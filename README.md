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

### Additional setup

#### Android

Add this to the root `build.gradle` file:

```gradle
allprojects {
    repositories {
        // Required for @pagopa/io-react-native-cbor
        maven { url("${project(':pagopa_io-react-native-cbor').projectDir}/libs") }
    }
}
```

## Usage

### CBOR

#### Decode CBOR to a JSON object

This method allows to decode a CBOR base64 encoded data to a JSON object. This method does not decode nested CBOR data, so it needs additional work in order fo fully decode a CBOR object.

```typescript
import { CBOR } from '@pagopa/io-react-native-cbor';

const decoded = await CBOR.decode(base64EncodedData);
```

#### Decode CBOR documents

This method allows to decode CBOR base64 encoded MDOC data to a `Documents` object

```typescript
import { CBOR } from '@pagopa/io-react-native-cbor';

const decodedDocuments = await CBOR.decodeDocuments(base64EncodedData);
```

### COSE

#### Sign data

```typescript
import { COSE } from '@pagopa/io-react-native-cbor';

const { dataSigned, publicKey } = await COSE.sign(data, keyAlias);
```

#### Verify data signature

```typescript
import { COSE } from '@pagopa/io-react-native-cbor';

const result = await COSE.verify(data, publicKey);
```

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
