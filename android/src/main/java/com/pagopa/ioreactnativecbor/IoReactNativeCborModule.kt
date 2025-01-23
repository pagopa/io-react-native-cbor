package com.pagopa.ioreactnativecbor

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import it.pagopa.cbor_implementation.parser.CBorParser
import kotlin.io.encoding.ExperimentalEncodingApi

class IoReactNativeCborModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  @OptIn(ExperimentalEncodingApi::class)
  @ReactMethod
  fun decode(base64: String, promise: Promise) {
    try {
      val rawCbor = kotlin.io.encoding.Base64.decode(base64)
      val json = CBorParser(rawCbor).toJson()
      promise.resolve(json)
    } catch (e: Exception){
      promise.reject(e)
    }
  }

  companion object {
    const val NAME = "IoReactNativeCbor"
  }
}
