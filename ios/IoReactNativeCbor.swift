import IOWalletCBOR
import IOWalletProximity
import CryptoKit

@objc(IoReactNativeCbor)
class IoReactNativeCbor: NSObject {
  private typealias ME = ModuleException
  private let keyConfig: KeyConfig = .ec
  
  @objc func decode(
    _ cbor: String,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    guard let data = Data(base64Encoded: cbor) else {
      ME.invalidEncoding.reject(reject: reject)
      return
    }
    
    guard let json = CborCose.jsonFromCBOR(data: data) else {
      ME.unableToDecode.reject(reject: reject)
      return
    }
    
    resolve(json);
  }
  
  
  @objc func decodeDocuments(
    _ mdoc: String,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    guard let data = Data(base64Encoded: mdoc) else {
      ME.invalidEncoding.reject(reject: reject)
      return
    }
    
    guard let json = CborCose.decodeCBOR(data: data, true, true) else {
      ME.unableToDecode.reject(reject: reject)
      return
    }
    
    resolve(json);
  }
  
  @objc func decodeIssuerSigned(
    _ issuerSigned: String,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    guard let data = Data(base64Encoded: issuerSigned) else {
      ME.invalidEncoding.reject(reject: reject)
      return
    }
    
    guard let json = CborCose.issuerSignedCborToJson(data: data) else {
      ME.unableToDecode.reject(reject: reject)
      return
    }
    
    resolve(json);
  }
  
  @objc func sign(
    _ payloadData: String,
    keyTag: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.global().async { [weak self] in
      guard self != nil else {
        ME.threadingError.reject(reject: reject)
        return
      }
      
      guard let data = Data(base64Encoded: payloadData) else {
        ME.invalidEncoding.reject(reject: reject)
        return
      }
      
      guard let coseKey = CoseKeyPrivate(crv: .p256, keyTag: keyTag) else {
        ME.publicKeyNotFound.reject(reject: reject)
        return
      }
      
      let signedPayload = CborCose.sign(data: data, privateKey: coseKey)
      resolve(signedPayload.base64EncodedString())
    }
  }
  
  @objc func verify(
    _ sign1Data: String,
    jwk: NSDictionary,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    do {
      guard let data = Data(base64Encoded: sign1Data) else {
        ME.invalidEncoding.reject(reject: reject)
        return
      }
      
      let publicKeyJson = try JSONSerialization.data(withJSONObject: jwk, options:[] )
      let publicKeyString = String(data: publicKeyJson, encoding: .utf8)!
      let publicKey = CoseKey(jwk: publicKeyString)!
      
      let verified = CborCose.verify(data: data, publicKey: publicKey)
      
      resolve(verified)
    } catch {
      ME.unexpected.reject(reject: reject)
    }
  }
  
  @objc func generateOID4VPDeviceResponse(
    _ clientId: String,
    responseUri: String,
    authorizationRequestNonce: String,
    mdocGeneratedNonce: String,
    documents: NSArray,
    fieldRequestedAndAccepted: String,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    
    do {
      let sessionTranscript = Proximity.shared.generateOID4VPSessionTranscriptCBOR(
          clientId: clientId,
          responseUri: responseUri,
          authorizationRequestNonce: authorizationRequestNonce,
          mdocGeneratedNonce: mdocGeneratedNonce
      )

      let documentsAsProximityDocument : [ProximityDocument] = try parseDocRequested(documents).reduce(into: []) { partialResult, document in
        guard let proximityDocument = ProximityDocument(docType: document.docType, issuerSigned: document.issuerSignedContent, deviceKeyTag: document.alias) else {
          throw ME.invalidDocRequested.error()
        }
        partialResult.append(proximityDocument)
      }
      
      let items = try JSONDecoder().decode([String : [String : [String : Bool]]].self, from: Data(fieldRequestedAndAccepted.utf8))
      
      do {
        let response = try Proximity.shared.generateDeviceResponse(items: items, documents: documentsAsProximityDocument, sessionTranscript: sessionTranscript)
        resolve(Data(response).base64EncodedString())
      } catch {
        ME.unableToGenerateResponse.reject(reject: reject)
        return
      }
      
      

      
    } catch let error as NSError where error.domain == ME.invalidDocRequested.rawValue {
      ME.invalidDocRequested.reject(reject: reject)
    } catch let error as DecodingError {
      ME.invalidItems.reject(reject: reject)
    } catch {
      ME.unexpected.reject(reject: reject)
    }
  }
  
  private func keyExists(keyTag: String) -> (key: SecKey?, status: OSStatus) {
    let getQuery = privateKeyKeychainQuery(keyTag: keyTag)
    var item: CFTypeRef?
    let status = SecItemCopyMatching(getQuery as CFDictionary, &item)
    return (status == errSecSuccess ? (item as! SecKey) : nil, status)
  }
  
  private func privateKeyKeychainQuery(
    keyTag: String
  ) -> [String : Any] {
    return [
      kSecClass as String: kSecClassKey,
      kSecAttrApplicationTag as String: keyTag,
      kSecAttrKeyType as String: keyConfig.keyType(),
      kSecReturnRef as String: true
    ]
  }
  
  private enum KeyConfig: Int, CaseIterable {
    case ec
    
    func keyType() -> CFString {
      switch self {
      case .ec:
        return kSecAttrKeyTypeECSECPrimeRandom
      }
    }
    
    func keySizeInBits() -> Int {
      switch self {
      case .ec:
        return 256
      }
    }
    
    func keySignAlgorithm() -> SecKeyAlgorithm {
      switch self {
      case .ec:
        return .ecdsaSignatureMessageX962SHA256
      }
    }
  }
  
  private enum ModuleException: String, CaseIterable {
    case unableToDecode = "UNABLE_TO_DECODE"
    case publicKeyNotFound = "PUBLIC_KEY_NOT_FOUND"
    case unableToSign = "UNABLE_TO_SIGN"
    case invalidEncoding = "INVALID_ENCODING"
    case threadingError = "THREADING_ERROR"
    case invalidDocRequested = "DOC_REQUESTED_PARSING_EXCEPTION"
    case unableToGenerateResponse = "UNABLE_TO_GENERATE_RESPONSE"
    case invalidItems = "REQUESTED_ITEMS_PARSING_EXCEPTION"
    case unexpected = "UNEXPECTED_ERROR"
    
    func error(userInfo: [String : Any]? = nil) -> NSError {
      switch self {
      case .unableToDecode:
        return NSError(domain: self.rawValue, code: -1, userInfo: userInfo)
      case .publicKeyNotFound:
        return NSError(domain: self.rawValue, code: -1, userInfo: userInfo)
      case .unableToSign:
        return NSError(domain: self.rawValue, code: -1, userInfo: userInfo)
      case .invalidEncoding:
        return NSError(domain: self.rawValue, code: -1, userInfo: userInfo)
      case .threadingError:
        return NSError(domain: self.rawValue, code: -1, userInfo: userInfo)
      case .invalidDocRequested:
        return NSError(domain: self.rawValue, code: -1, userInfo: userInfo)
      case .unableToGenerateResponse:
        return NSError(domain: self.rawValue, code: -1, userInfo: userInfo)
      case .invalidItems:
        return NSError(domain: self.rawValue, code: -1, userInfo: userInfo)
      case .unexpected:
        return NSError(domain: self.rawValue, code: -1, userInfo: userInfo)
      }
    }
    
    func reject(reject: RCTPromiseRejectBlock, _ moreUserInfo: (String, Any)...) {
      var userInfo = [String : Any]()
      moreUserInfo.forEach { userInfo[$0.0] = $0.1 }
      let error = error(userInfo: userInfo)
      reject("\(error.code)", error.domain, error)
    }
  }
  
  private class DocRequested {
    var issuerSignedContent : [UInt8]
    var alias : String
    var docType : String
    
    public init(issuerSignedContent: [UInt8], alias: String, docType: String) {
      self.issuerSignedContent = issuerSignedContent
      self.alias = alias
      self.docType = docType
    }
  }
  
  private func parseDocRequested(_ array : NSArray) throws -> [DocRequested] {
    return try array.compactMap { (element) -> DocRequested in
      guard let dict : NSDictionary = element as? NSDictionary else { throw ModuleException.unableToDecode.error() }
      guard
        let issuerSignedContent = dict["issuerSignedContent"] as? String,
        let alias = dict["alias"] as? String,
        let docType = dict["docType"] as? String,
        let issuerSignedBytesData = Data(base64Encoded: issuerSignedContent)
      else { throw ModuleException.invalidDocRequested.error() }
  
      return DocRequested(issuerSignedContent: Array(issuerSignedBytesData), alias: alias, docType: docType)
    }
  }

}
