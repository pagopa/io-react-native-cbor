import { IoReactNativeCbor } from '../utils/proxy';
import { SignResult } from './types';

/**
 * Sign base64 encoded data with COSE
 *
 * @param data - The base64 encoded data to sign
 * @param alias - The alias of the key to use for signing. If the key does not exist, it will be generated.
 * @returns The signature and the public key
 */
export const sign = async (data: string, alias: string): Promise<SignResult> =>
  await IoReactNativeCbor.sign(data, alias);

/**
 * Verify a signature with the provided public key
 *
 * @param signature - The signature to verify
 * @param publicKey - The public key to use for verification
 * @returns The result of the verification
 */
export const verify = async (
  dataSigned: string,
  publicKey: string
): Promise<boolean> => await IoReactNativeCbor.verify(dataSigned, publicKey);
