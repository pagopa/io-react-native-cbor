## COSE

This module provides methods to sign and verify data with COSE.

```typescript
import { COSE } from '@pagopa/io-react-native-cbor';
```

### Methods

#### `sign`

Signs base64 encoded data using COSE (CBOR Object Signing and Encryption).

```typescript
// base64 encoded data
const dataToSign = '....';
// alias for the signing key
const keyAlias = 'my-key-alias';

const dataSigned = await COSE.sign(dataToSign, keyAlias);
```

**Parameters:**

- `data` (string): The base64 encoded data to sign
- `alias` (string): The alias of the key to use for signing. If the key doesn't exist, it will be generated

**Returns:**

- `Promise<string>`: A promise that resolves with the base64 encoded signature

#### `verify`

Verifies a COSE signature using the provided public key.

```typescript
// signed data to verify
const dataSigned = '....';
// public key in JWK format
const publicKey = {
  kty: 'EC',
  crv: 'P-256',
  x: '...',
  y: '...',
};

const isValid = await COSE.verify(dataSigned, publicKey);
```

**Parameters:**

- `signature` (string): The signed data to verify
- `publicKey` (PublicKey): The public key in JWK format

**Returns:**

- `Promise<boolean>`: A promise that resolves with the verification result (true if valid, false otherwise)
