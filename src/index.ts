export { decode, decodeDocuments } from './cbor';
export type {
  DecodedDocuments,
  IssuerSigned,
  DocumentValue,
  MDOC,
} from './cbor/schema';
export { sign, verify } from './cose';
export type { COSESignResult } from './cose/types';
