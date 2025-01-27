## CBOR

This module provides methods to sign and verify data with COSE.

```typescript
import { COSE } from '@pagopa/io-react-native-cbor';
```

### Methods

#### `sign`

_TBA_

```typescript
const dataToSign = '....';

const { dataSigned, publicKey } = await COSE.sign(dataToSign, keyAlias);
```

#### `verify`

_TBA_

```typescript
const dataSigned = '....';
const publicKey = '....';

const isValid = await COSE.verify(dataSigned, publicKey);
```

### Types

#### `SignResult`

```typescript
type SignResult = {
  dataSigned: string;
  publicKey: string;
};
```
