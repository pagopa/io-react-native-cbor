import { IoReactNativeCbor } from '../utils/proxy';
import { Documents, DocumentsFromString } from './schema';

/**
 * Decode base64 encoded CBOR data to JSON object.
 *
 * If it is not possibile to decode the provided data, the promise will be rejected with
 * an instance of {@link CborError}.
 *
 * **NOTE**: this method does not handle nested CBOR data, which will need additional
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
 * If it is not possibile to decode the provided data, the promise will be rejected with
 * an instance of {@link CborError}.
 *
 * @param data - The base64 encoded MDOC data
 * @returns The decoded data as mDOC object
 */
export const decodeDocuments = async (data: string): Promise<Documents> => {
  const json = await IoReactNativeCbor.decodeDocuments(data);
  return await DocumentsFromString.parseAsync(json);
};
