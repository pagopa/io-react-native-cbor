import { IoReactNativeCbor } from '../utils/proxy';

/**
 * Sign base64 encoded data with COSE
 *
 * @param data - The base64 encoded data to sign
 * @param alias - The alias of the key to use for signing
 * @returns The signature and the public key
 */
export const sign = async (data: string, alias: string) =>
  await IoReactNativeCbor.signWithCOSE(data, alias);

export const verify = () => {
  return null;
};

export const createSecurePrivateKey = () => {
  return null;
};
