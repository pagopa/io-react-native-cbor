import { IoReactNativeCbor } from '../utils/proxy';
import type { CoseSignature } from './types';

/**
 * Sign base64 encoded data with COSE
 *
 * @param data - The base64 encoded data to sign
 * @param alias - The alias of the key to use for signing
 * @returns The signature and the public key
 */
export const sign = async (
  data: string,
  alias: string
): Promise<CoseSignature> => await IoReactNativeCbor.sign(data, alias);

/**
 * Verify a signature with the provided public key
 *
 * @param signature - The signature to verify
 * @param publicKey - The public key to use for verification
 * @returns The result of the verification
 */
export const verify = async ({
  dataSigned,
  publicKey,
}: CoseSignature): Promise<boolean> =>
  await IoReactNativeCbor.verify(dataSigned, publicKey);
