import { IoReactNativeCbor } from '../utils/proxy';
import { PublicKey } from '@pagopa/io-react-native-crypto';

/**
 * Sign base64 encoded data with COSE
 *
 * @param data - The base64 encoded data to sign
 * @param alias - The alias of the key to use for signing. If the key does not exist, it will be generated.
 * @returns The signature
 */
export const sign = async (data: string, alias: string): Promise<string> =>
  await IoReactNativeCbor.sign(data, alias);

/**
 * Verify a signature with the provided public key
 *
 * @param signature - The signed data to verify
 * @param publicKey - The public key in JWK format
 * @returns The result of the verification
 */
export const verify = async (
  signature: string,
  publicKey: PublicKey
): Promise<boolean> => await IoReactNativeCbor.verify(signature, publicKey);
