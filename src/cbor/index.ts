import { IoReactNativeCbor } from '../utils/proxy';

/**
 * CBOR class which represents a CBOR data in base64 format
 *
 * @param data - The base64 encoded CBOR data
 */
export class CBOR {
  constructor(private data: string) {
    this.data = data;
  }

  /**
   * Decode the CBOR data to JSON
   *
   * @returns The decoded data
   */
  decode(): Promise<string> {
    return IoReactNativeCbor.decode(this.data);
  }
}
