import cbor

@objc(IoReactNativeCbor)
class IoReactNativeCbor: NSObject {

  @objc(multiply:withB:withResolver:withRejecter:)
  func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    resolve(a*b)
    let test = CoseKey(jwk: "")
  }
}
