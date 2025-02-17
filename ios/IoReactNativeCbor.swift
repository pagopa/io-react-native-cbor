import IOWalletCBOR
import CryptoKit

@objc(IoReactNativeCbor)
class IoReactNativeCbor: NSObject {
  private typealias ME = ModuleException
  private let keyConfig: KeyConfig = .ec
  
  @objc func decode(_ data: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    guard let bytes = Data(base64Encoded: data) else {
      reject("Error", nil, nil);
      return
    }
    
    guard let json = CborCose.jsonFromCBOR(data: bytes) else {
      reject("Error", nil, nil);
      return
    }
    
    resolve(json);
  }
  
  @objc func decodeDocuments(_ data: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    guard let bytes = Data(base64Encoded: data) else {
      reject("Error", nil, nil);
      return
    }
    
    guard let json = CborCose.decodeCBOR(data: bytes, true, true) else {
      reject("Error", nil, nil);
      return
    }
    
    resolve(json);
  }
  
  @objc func sign(_ dataToSign: String, keyTag: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
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
      let signedPayload = CborCose.sign(data: dataToSign.data(using: .utf8)!, privateKey: coseKey)
      
      resolve(signedPayload.base64EncodedString())
    } catch {
      ME.unexpected.reject(reject: reject)
    }
  }
  
  @objc func verify(_ dataSigned: String, jwk: NSDictionary, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    do {
      let data = Data(base64Encoded: dataSigned)!
      
      let jwkData = try JSONSerialization.data(withJSONObject: jwk)
      let jwkString = String(data: jwkData, encoding: .utf8)!
      let publicKey = CoseKey(crv: .p256, x963Representation: Data(base64Encoded: "hEOhASagS0hlbGxvIHdvcmxkWEAiMiuMigVled/z/1BpY1qt8eVO95jv34dimB8p5q2VnfTdDKlXCAIrLFhM3Ir3v7zkss3tEUP+iW6lLfmTavbL")!)
      
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
    case unexpected = "UNEXPECTED_ERROR"
    
    func error(userInfo: [String : Any]? = nil) -> NSError {
      switch self {
      case .unableToDecode:
        return NSError(domain: self.rawValue, code: -1, userInfo: userInfo)
      case .publicKeyNotFound:
        return NSError(domain: self.rawValue, code: -1, userInfo: userInfo)
      case .unableToSign:
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
