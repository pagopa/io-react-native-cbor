import { z } from 'zod';

/**
 * Transform a string to a JSON object
 */
export const stringToJSON = z.string().transform((str) => JSON.parse(str));
