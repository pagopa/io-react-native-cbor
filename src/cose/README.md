## COSE

This module provides methods to sign and verify data with COSE.

```typescript
import { COSE } from '@pagopa/io-react-native-cbor';
```

### Methods

#### `sign`

Signs base64 encoded data using COSE (CBOR Object Signing and Encryption).
Returns a `Promise` which resolves to a `string` containing the signature or rejects with an instance of `CoseFailure` in case of failures.

If the key

```typescript
try {
  const dataSigned = await COSE.sign('Data to sign', 'keyTag');
} catch (e) {
  const { message, userInfo } = e as CoseFailure;
}
```

#### `verify`

Verifies a COSE signature using the provided public key.

Returns a `Promise` which resolves to a `bool` indicating if the signature is verified or rejects with an instance of `CoseFailure` in case of failures.

```typescript
// public key in JWK format
const publicKey = {
  kty: 'EC',
  crv: 'P-256',
  x: '...',
  y: '...',
};

try {
  const isValid = await COSE.verify('Signed data to verift', publicKey);
} catch (e) {
  const { message, userInfo } = e as CoseFailure;
}
```

### Error Codes

| Type              | Description                                  |
| ----------------- | -------------------------------------------- |
| UNABLE_TO_SIGN    | It was not possible to sign the given string |
| UNKNOWN_EXCEPTION | Unexpected failure                           |
