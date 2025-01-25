export { decode, decodeDocuments } from './cbor/decoder';
export type {
  DecodedDocuments,
  IssuerSigned,
  DocumentValue,
  MDOC,
} from './cbor/schema';
export { sign, verify } from './cose';
export type { CoseSignature } from './cose/types';
