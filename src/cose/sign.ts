import { PublicKey } from '@pagopa/io-react-native-crypto';
import { IoReactNativeCbor } from '../utils/proxy';

/**
 * Sign base64 encoded data with COSE
 *
 * @param data - The base64 encoded data to sign
 * @param alias - The alias of the key to use for signing.
 * @throws {CoseFailure} If the key does not exist
 * @returns The signature
 */
export const sign = async (coseData: string, keyTag: string): Promise<string> =>
  await IoReactNativeCbor.sign(coseData, keyTag);

/**
 * Verifies a Sign1 message with the provided public key
 *
 * @param signature - The Sign1 message to verify
 * @param publicKey - The public key in JWK format
 * @returns The result of the verification
 */
export const verify = async (
  data: string,
  publicKey: PublicKey
): Promise<boolean> => await IoReactNativeCbor.verify(data, publicKey);
