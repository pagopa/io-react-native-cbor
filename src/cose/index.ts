import { IoReactNativeCbor } from '../utils/proxy';

export const sign = async (data: string, alias: string) => {
  const { signature, publicKey } = await IoReactNativeCbor.signWithCOSE(
    data,
    alias
  );
  return { signature, publicKey };
};

export const verify = () => {
  return null;
};

export const createSecurePrivateKey = () => {
  return null;
};
