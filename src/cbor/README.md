## CBOR

This module provides methods to decode CBOR data into readable objects.

```typescript
import { CBOR } from '@pagopa/io-react-native-cbor';
```

### Methods

#### `decode`

This method allows the decode of CBOR data into readable JSON objectes.

**Note**: this method does not decode nested CBOR objects and therefore complex objects needs additional manual decoding

```typescript
const bade64EncodedData = '....';
const decoded = await CBOR.decode(bade64EncodedData);
```

#### `decodeDocuments`

This metod allows the decoding of CBOR data which contains MDOC objects. The result of this function is a [Documents](#documents) object

```typescript
const bade64EncodedData = '....';
const decodedDocuments = await CBOR.decodeDocuments(bade64EncodedData);
```

### Types

#### `Documents`

```typescript
type Documents = {
  status?: number;
  version?: string;
  documents?: Array<MDOC>;
};
```

#### `MDOC`

```typescript
type MDOC = {
  docType?: DocumentType;
  issuerSigned?: IssuerSigned;
};
```

#### `IssuerSigned`

```typescript
type IssuerSigned = {
  nameSpaces?: Record<string, Array<DocumentValue>>;
  issuerAuth?: string;
};
```

#### `DocumentValue`

```typescript
type DocumentValue = {
  digestID?: number;
  random?: string;
  elementIdentifier?: string;
  elementValue?: string;
};
```

#### `DocumentType`

```typescript
enum DocumentTypeEnum {
  MDL = 'org.iso.18013.5.1.mDL',
  EU_PID = 'eu.europa.ec.eudi.pid.1',
}
```
