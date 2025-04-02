import { IoReactNativeCbor } from '../utils/proxy';

type DocRequested = {
  issuerSignedContent: string;
  alias: string;
  docType: string;
};

export const generateOID4VPDeviceResponse = async (
  clientId: string,
  responseUri: string,
  authorizationRequestNonce: string,
  mdocGeneratedNonce: string,
  documents: DocRequested[],
  fieldRequestedAndAccepted: Record<string, any> | string
) => {
  return await IoReactNativeCbor.generateOID4VPDeviceResponse(
    clientId,
    responseUri,
    authorizationRequestNonce,
    mdocGeneratedNonce,
    documents,
    typeof fieldRequestedAndAccepted === 'string'
      ? fieldRequestedAndAccepted
      : JSON.stringify(fieldRequestedAndAccepted)
  );
};
