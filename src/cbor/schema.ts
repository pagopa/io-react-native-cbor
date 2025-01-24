import { z } from 'zod';

/**
 * Transform a string to a JSON object
 */
const stringToJSON = z.string().transform((str) => JSON.parse(str));

/**
 * This preprocess function is used to transform the claim object to a format
 * that can be parsed by the DocumentClaim schema
 *
 * It takes an object with the following structure:
 * ```
 * {
 *   digestID: 0,
 *   random: "123456",
 *   X: Y,
 * }
 * ```
 *
 * and returns an object with the following structure:
 * ```
 * {
 *   digestID: 0,
 *   random: "123456",
 *   elementIdentifier: "X",
 *   elementValue: Y,
 * }
 * ```
 */
const claimPreprocess = (obj: any) => {
  const knownKeys = new Set([
    'digestID',
    'random',
    'elementIdentifier',
    'elementValue',
  ]);
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (knownKeys.has(key)) {
        return {
          ...acc,
          [key]: value,
        };
      }

      // If the key is not known, means it's the value of the claim
      return {
        ...acc,
        elementIdentifier: key,
        elementValue: value,
      };
    },
    {} as Record<string, unknown>
  );
};

/**
 * Claim contained in a document
 */
export const DocumentClaim = z.preprocess(
  claimPreprocess,
  z.object({
    digestID: z.number().optional(),
    random: z.string().optional(),
    elementIdentifier: z.string().optional(),
    elementValue: z.any().optional(),
  })
);

export const IssuerSigned = z.object({
  nameSpaces: z
    .record(z.string(), stringToJSON.pipe(z.array(DocumentClaim)))
    .optional(),
  issuerAuth: z.string().optional(),
});

export const MDOC = z.object({
  docType: z.string().optional(),
  issuerSigned: IssuerSigned.optional(),
});

export const DecodedDocuments = z.object({
  status: z.number().optional(),
  version: z.string().optional(),
  documents: stringToJSON.pipe(z.array(MDOC)).optional(),
});

export type DocumentClaim = z.infer<typeof DocumentClaim>;
export type IssuerSigned = z.infer<typeof IssuerSigned>;
export type MDOC = z.infer<typeof MDOC>;
export type DecodedDocuments = z.infer<typeof DecodedDocuments>;
