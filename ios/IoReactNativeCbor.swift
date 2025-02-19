import IOWalletCBOR
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
  
  @objc func sign(
    _ payloadData: String,
    keyTag: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.global().async { [weak self] in
      guard let self = self else {
        ME.threadingError.reject(reject: reject)
        return
      }
      
      guard let data = Data(base64Encoded: payloadData) else {
        ME.invalidEncoding.reject(reject: reject)
        return
      }
      
      do {
        var privateKey: SecKey?
        var status: OSStatus
        
        (privateKey, status) = keyExists(keyTag: keyTag)
        
        guard status == errSecSuccess else {
          ME.publicKeyNotFound.reject(reject: reject)
          return
        }
        
        guard let privateKey = privateKey,
              let publicKey = SecKeyCopyPublicKey(privateKey) else {
          ME.publicKeyNotFound.reject(reject: reject)
          return
        }
        
        let se256 = try CryptoKit.SecureEnclave.P256.KeyAgreement.PrivateKey()
        let publicKeyx963Data  = SecKeyCopyExternalRepresentation(publicKey, nil)! as Data
        let coseKey = CoseKeyPrivate(publicKeyx963Data: publicKeyx963Data, secureEnclaveKeyID: se256.dataRepresentation)
        
        let signedPayload = CborCose.sign(data: data, privateKey: coseKey)
        
        resolve(signedPayload.base64EncodedString())
      } catch {
        ME.unexpected.reject(reject: reject)
      }
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
  
}
