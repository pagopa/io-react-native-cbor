import { PublicKey } from '@pagopa/io-react-native-crypto';
import { IoReactNativeCbor } from '../utils/proxy';

/**
 * Sign base64 encoded data with COSE and return the COSE-Sign1 object in base64 encoding
 *
 * @param data - The base64 encoded data to sign
 * @param alias - The alias of the key to use for signing.
 * @throws {CoseFailure} If the key does not exist
 * @returns The COSE-Sign1 object in base64 encoding
 */
export const sign = async (coseData: string, keyTag: string): Promise<string> =>
  await IoReactNativeCbor.sign(coseData, keyTag);

/**
 * Verifies a COSE-Sign1 object with the provided public key
 *
 * @param data - The COSE-Sign1 object in base64 encoding
 * @param publicKey - The public key in JWK format
 * @returns true if the signature is valid, false otherwise
 */
export const verify = async (
  data: string,
  publicKey: PublicKey
): Promise<boolean> => await IoReactNativeCbor.verify(data, publicKey);
