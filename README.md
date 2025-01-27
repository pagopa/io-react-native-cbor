# @pagopa/io-react-native-cbor

Native module for CBOR

## Installation

```sh
npm install @pagopa/io-react-native-cbor
```

or

```sh
yarn add @pagopa/io-react-native-cbor
```

#### Additional setup

#### Android

In orded to make this package work on Android you need to add this to the root `build.gradle` file:

```gradle
allprojects {
    repositories {
        // Required for @pagopa/io-react-native-cbor
        maven { url("${project(':pagopa_io-react-native-cbor').projectDir}/libs") }
    }
}
```

## Modules

- [CBOR](/src/cbor/README.md)
- [COSE](/src/cose/README.md)

## Example

There is an example app which you can use to try and understand how to use this package:

```sh
cd example

yarn install

# For iOS
yarn ios

# For Android
yarn android
```
