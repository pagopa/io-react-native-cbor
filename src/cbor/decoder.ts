import { IoReactNativeCbor } from '../utils/proxy';
import { DecodedDocuments } from './schema';

/**
 * Decode base64 encoded CBOR data to JSON object
 *
 * NOTE: this method does not handle nested CBOR data, which will need manual
 * parsing.
 *
 * @param data - The base64 encoded CBOR data
 * @returns The decoded data as JSON object
 */
export const decode = async (data: string): Promise<any> => {
  const jsonString = await IoReactNativeCbor.decode(data);
  return JSON.parse(jsonString);
};

/**
 * Decode base64 encoded CBOR data to mDOC object
 *
 * @param data - The base64 encoded MDOC data
 * @returns The decoded data as mDOC object
 */
export const decodeDocuments = async (
  data: string
): Promise<DecodedDocuments> => {
  const jsonString = await IoReactNativeCbor.decodeDocuments(data);
  if (jsonString === null) {
    throw new Error('Failed to decode documents data');
  }
  const json = JSON.parse(jsonString);
  const decoded = DecodedDocuments.parse(json);
  return decoded;
};
