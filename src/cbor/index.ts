import { IoReactNativeCbor } from '../utils/proxy';

/**
 * Decode base64 encoded CBOR data to JSON object
 *
 * @param data - The base64 encoded CBOR data
 * @returns The decoded data as JSON object
 */
export const decode = async (data: string): Promise<any> => {
  const jsonString = await IoReactNativeCbor.decode(data);
  return JSON.parse(jsonString);
};
