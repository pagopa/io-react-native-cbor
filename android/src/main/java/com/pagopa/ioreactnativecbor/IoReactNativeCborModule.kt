package com.pagopa.ioreactnativecbor

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
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
      json?.let {
        promise.resolve(it)
      } ?: run {
        ModuleException.UNABLE_TO_DECODE.reject(promise)
      }
    } catch (e: Exception){
      ModuleException.UNKNOWN_EXCEPTION.reject(promise, Pair(ERROR_USER_INFO_KEY, e.message ?: ""))
    }
  }

  @OptIn(ExperimentalEncodingApi::class)
  @ReactMethod
  fun decodeDocuments(data: String, promise: Promise) {
    try {
      val buffer = kotlin.io.encoding.Base64.decode(data)
      CBorParser(buffer).documentsCborToJson(true) { json ->
        json?.let {
          promise.resolve(it)
        } ?: run {
          ModuleException.UNABLE_TO_DECODE.reject(promise)
        }
      }
    } catch (e: Exception){
      ModuleException.UNKNOWN_EXCEPTION.reject(promise, Pair(ERROR_USER_INFO_KEY, e.message ?: ""))
    }
  }

  @OptIn(ExperimentalEncodingApi::class)
  @ReactMethod
  fun sign(data: String, keyTag: String, promise: Promise) {
    try {
      when (val result = COSEManager().signWithCOSE(
        data = kotlin.io.encoding.Base64.decode(data),
        alias = keyTag
      )) {
        is SignWithCOSEResult.Failure -> {
          if(result.msg === "Key doesn't exists!!") {
            ModuleException.PUBLIC_KEY_NOT_FOUND.reject(promise)
          } else {
            ModuleException.UNABLE_TO_SIGN.reject(promise)
          }
        }
        is SignWithCOSEResult.Success -> {
          val base64Signature = kotlin.io.encoding.Base64.encode(result.signature)
          promise.resolve(base64Signature)
        }
      }
    } catch (e: Exception){
      ModuleException.UNKNOWN_EXCEPTION.reject(promise, Pair(ERROR_USER_INFO_KEY, e.message ?: ""))
    }
  }

  @OptIn(ExperimentalEncodingApi::class)
  @ReactMethod
  fun verify(payloadData: String, publicKey: ReadableMap, promise: Promise) {
    try {
      val result = COSEManager().verifySign1FromJWK(
        dataSigned = kotlin.io.encoding.Base64.decode(payloadData),
        jwk = publicKey.toString()
      )
      promise.resolve(result)
    } catch (e: Exception){
      ModuleException.UNKNOWN_EXCEPTION.reject(promise, Pair(ERROR_USER_INFO_KEY, e.message ?: ""))
    }
  }

  companion object {
    const val NAME = "IoReactNativeCbor"
    const val ERROR_USER_INFO_KEY = "error"

    private enum class ModuleException(
      val ex: Exception
    ) {
      UNABLE_TO_DECODE(Exception("UNABLE_TO_DECODE")),
      PUBLIC_KEY_NOT_FOUND(Exception("PUBLIC_KEY_NOT_FOUND")),
      UNABLE_TO_SIGN(Exception("UNABLE_TO_SIGN")),
      UNKNOWN_EXCEPTION(Exception("UNKNOWN_EXCEPTION"));

      fun reject(
        promise: Promise, vararg args: Pair<String, String>
      ) {
        exMap(*args).let {
          promise.reject(it.first, ex.message, it.second)
        }
      }

      private fun exMap(vararg args: Pair<String, String>): Pair<String, WritableMap> {
        val writableMap = WritableNativeMap()
        args.forEach { writableMap.putString(it.first, it.second) }
        return Pair(this.ex.message ?: "UNKNOWN", writableMap)
      }
    }
  }
}
