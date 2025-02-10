package com.pagopa.ioreactnativecbor

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.nimbusds.jose.jwk.ECKey
import it.pagopa.cbor_implementation.cose.COSEManager
import it.pagopa.cbor_implementation.cose.SignWithCOSEResult
import it.pagopa.cbor_implementation.parser.CBorParser
import org.json.JSONObject
import kotlin.io.encoding.ExperimentalEncodingApi

class IoReactNativeCborModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  @OptIn(ExperimentalEncodingApi::class)
  @ReactMethod
  fun decode(data: String, promise: Promise) {
    try {
      val buffer = kotlin.io.encoding.Base64.decode(data)
      val json = CBorParser(buffer).toJson()
      promise.resolve(json)
    } catch (e: Exception){
      promise.reject(e)
    }
  }

  @OptIn(ExperimentalEncodingApi::class)
  @ReactMethod
  fun decodeDocuments(data: String, promise: Promise) {
    try {
      val buffer = kotlin.io.encoding.Base64.decode(data)
      CBorParser(buffer).documentsCborToJson { json ->
        promise.resolve(json)
      }
    } catch (e: Exception){
      promise.reject(e)
    }
  }

  @OptIn(ExperimentalEncodingApi::class)
  @ReactMethod
  fun sign(data: String, alias: String, promise: Promise) {
    try {
      when (val result = COSEManager().signWithCOSE(
        data = kotlin.io.encoding.Base64.decode(data),
        alias = alias
      )) {
        is SignWithCOSEResult.Failure -> {
          promise.reject(Exception(result.msg))
        }
        is SignWithCOSEResult.Success -> {
          val base64Signature = kotlin.io.encoding.Base64.encode(result.signature)
          promise.resolve(base64Signature)
        }
      }
    } catch (e: Exception){
      promise.reject(e)
    }
  }

  @OptIn(ExperimentalEncodingApi::class)
  @ReactMethod
  fun verify(dataSigned: String, publicKey: ReadableMap, promise: Promise) {
    try {
      // Parse JWK to ECKey
      val jwkJson = (publicKey.toHashMap() as Map<*, *>?)?.let { JSONObject(it) }
      val ecKey = ECKey.parse(jwkJson.toString())

      // Convert to public key
      val publicKeyInstance = ecKey.toPublicKey()

      val result = COSEManager().verifySign1(
        dataSigned = kotlin.io.encoding.Base64.decode(dataSigned),
        publicKey =  publicKeyInstance.encoded
      )
      promise.resolve(result)
    } catch (e: Exception){
      promise.reject(e)
    }
  }

  companion object {
    const val NAME = "IoReactNativeCbor"
  }
}
