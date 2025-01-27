import { z } from 'zod';
import { claimPreprocess, stringToJSON } from './schema.utils';

export enum DocumentTypeEnum {
  MDL = 'org.iso.18013.5.1.mDL',
  EU_PID = 'eu.europa.ec.eudi.pid.1',
}

export const DocumentType = z.nativeEnum(DocumentTypeEnum);
export type DocumentType = z.infer<typeof DocumentType>;

/**
/**
 * Value contained in a document
 */
export const DocumentValue = z.preprocess(
  claimPreprocess,
  z.object({
    digestID: z.number().optional(),
    random: z.string().optional(),
    elementIdentifier: z.string(),
    elementValue: z.any(),
  })
);

export type DocumentValue = z.infer<typeof DocumentValue>;

/**
 * Issuer signed object
 */
export const IssuerSigned = z.object({
  nameSpaces: z.record(z.string(), stringToJSON.pipe(z.array(DocumentValue))),
  issuerAuth: z.string(),
});

export type IssuerSigned = z.infer<typeof IssuerSigned>;

/**
 * mDOC object
 */
export const MDOC = z.object({
  docType: DocumentType,
  issuerSigned: IssuerSigned,
});

export type MDOC = z.infer<typeof MDOC>;

/**
 * CBOR decoded data containing the status, version and the list of documents
 */
export const Documents = z.object({
  status: z.number().optional(),
  version: z.string().optional(),
  documents: stringToJSON.pipe(z.array(MDOC)),
});

/**
 * Documents object from string
 */
export const DocumentsFromString = stringToJSON.pipe(Documents);

export type Documents = z.infer<typeof Documents>;
