import { z } from 'zod';

/**
 * Transform a string to a JSON object
 */
export const stringToJSON = z.string().transform((str) => JSON.parse(str));

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
export const claimPreprocess = (obj: any) => {
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
