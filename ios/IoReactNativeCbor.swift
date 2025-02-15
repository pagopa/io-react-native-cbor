import IOWalletCBOR

@objc(IoReactNativeCbor)
class IoReactNativeCbor: NSObject {
  
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
  
  @objc func sign(_ data: String, keyTag: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    do {
      
      resolve("")
      
    } catch {
      reject("Error", "\(error)", error);
    }
  }
  
  @objc func verify(_ dataSigned: String, jwk: NSDictionary, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    do {
      let publicKeyJson = try JSONSerialization.data(withJSONObject: jwk, options:[] )
      let publicKeyJsonString = String(data: publicKeyJson, encoding: .utf8)!
      let publicKey = CoseKey(jwk: publicKeyJsonString)!
      let data = Data(base64Encoded: dataSigned)!
      
      let verified = CborCose.verify(data: data, publicKey: publicKey)
      
      resolve(verified)
    } catch {
      reject("Error", "\(error)", error);
    }
  }
  
}
