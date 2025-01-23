package com.pagopa.ioreactnativecbor

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import it.pagopa.cbor_implementation.cose.COSEManager
import it.pagopa.cbor_implementation.cose.SignWithCOSEResult
import it.pagopa.cbor_implementation.parser.CBorParser
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
  fun signWithCOSE(data: String, alias: String, promise: Promise) {
    try {
      val buffer = kotlin.io.encoding.Base64.decode(data)
      when (val result = COSEManager().signWithCOSE(
        data = buffer,
        alias = alias
      )) {

        is SignWithCOSEResult.Failure -> {
          promise.reject(Exception(result.msg))
        }
        is SignWithCOSEResult.Success -> {
          val arguments = Arguments.createMap().apply {
            putString("signature", kotlin.io.encoding.Base64.encode(result.signature))
            putString("publicKey", kotlin.io.encoding.Base64.encode(result.publicKey))
          }
          promise.resolve(arguments)
        }
      }
    } catch (e: Exception){
      promise.reject(e)
    }
  }

  companion object {
    const val NAME = "IoReactNativeCbor"
  }
}
