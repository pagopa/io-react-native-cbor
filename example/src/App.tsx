import { CBOR, COSE, ISO18013 } from '@pagopa/io-react-native-cbor';
import {
  generate,
  getPublicKey,
  type PublicKey,
} from '@pagopa/io-react-native-crypto';
import { Alert, Button, SafeAreaView, Text, View } from 'react-native';
import mdlCbor from './mocks/mdl';
import moreDocsCbor from './mocks/moreDocs';
import moreDocsIssuerAuthCbor from './mocks/moreDocsIssuerAuth';
import oneDocCbor from './mocks/oneDoc';
import oneDocIssuerAuth from './mocks/oneDocIssuerAuth';
import deviceRequest, {
  wrongDocRequest,
  wrongFieldRequestedAndAccepted,
  incompleteDocRequest,
} from './mocks/deviceRequest';
import { styles } from './styles';

const KEYTAG = 'TEST_KEYTAG';

// "This is test data" base64 encoded
const DATA_TO_SIGN = 'VGhpcyBpcyBhIHRlc3QgZGF0YQ==';

// COSE Sign1 object with payload `This is test data`
const DATA_TO_VERIFY =
  'hEOhASagU1RoaXMgaXMgYSB0ZXN0IGRhdGFYQDfXLpQpsSZyBJE+0AvBs27tuqIuNEeuRYQACPSLFGT9X18d8RrLkBS0f/AYKbFpW+zd6CmFQ8ry9xkZOT1lkbg=';

const TEST_KEY: PublicKey = {
  kty: 'EC',
  crv: 'P-256',
  y: 'AO4+pA5yIuxHLJqJogiLT90o+gwZnND2qEQjEfMZ+Tta',
  x: 'AP06ubTkmvo+U1HeiZ35xKHaox++EX6ViRkGnKHclVJB',
};

export default function App() {
  const generateKeyIfNotExists = async (keyTag: string) => {
    try {
      await getPublicKey(keyTag);
    } catch (error: any) {
      await generate(keyTag);
    }
  };

  const handleDecode = (data: string) => async () => {
    try {
      const decoded = await CBOR.decodeDocuments(data);
      console.log('✅ CBOR Decode Success\n', JSON.stringify(decoded, null, 2));
      Alert.alert('✅ CBOR Decode Success');
    } catch (error: any) {
      console.log('❌ CBOR Decode Error\n', JSON.stringify(error, null, 2));
      Alert.alert('❌ CBOR Decode Error');
    }
  };

  const handleDecodeIssuerSigned = (data: string) => async () => {
    try {
      const decoded = await CBOR.decodeIssuerSigned(data);
      console.log(
        '✅ CBOR Issuer Signed With Decoded Issuer Auth Decode Success\n',
        JSON.stringify(decoded, null, 2)
      );
      Alert.alert(
        '✅ CBOR Issuer Signed With Decoded Issuer Auth Decode Success'
      );
    } catch (error: any) {
      console.log(
        '❌ CBOR Issuer Signed With Decoded Issuer Auth Decode Error\n',
        JSON.stringify(error, null, 2)
      );
      Alert.alert(
        '❌ CBOR Issuer Signed With Decoded Issuer Auth Decode Error'
      );
    }
  };

  const handleTestSign = async () => {
    try {
      await generateKeyIfNotExists(KEYTAG);
      const key = await getPublicKey(KEYTAG);
      const result = await COSE.sign(DATA_TO_SIGN, KEYTAG);
      console.log('✅ Sign Success\n', result);
      console.log('🔑 Public Key\n', JSON.stringify(key, null, 2));
      Alert.alert('✅ Sign Success');
    } catch (error: any) {
      console.log('❌ COSE Sign Error\n', JSON.stringify(error, null, 2));
      Alert.alert('❌ COSE Sign Error');
    }
  };

  const handleTestVerify = async () => {
    try {
      const result = await COSE.verify(DATA_TO_VERIFY, TEST_KEY);
      if (result) {
        Alert.alert('✅ Verification Success');
      } else {
        Alert.alert('❌ Verification Failed');
      }
    } catch (error: any) {
      console.log('❌ Verify Error\n', JSON.stringify(error, null, 2));
      Alert.alert('❌ Verify Error', error.message);
    }
  };

  const handleGenerateResponse = async () => {
    try {
      await generateKeyIfNotExists(KEYTAG);
      const result = await ISO18013.generateOID4VPDeviceResponse(
        deviceRequest.request.clientId,
        deviceRequest.request.responseUri,
        deviceRequest.request.authorizationRequestNonce,
        deviceRequest.request.mdocGeneratedNonce,
        deviceRequest.documents,
        deviceRequest.fieldRequestedAndAccepted
      );
      console.log(result);
      Alert.alert('✅ Device Response Generation Success');
    } catch (error: any) {
      console.log(
        '❌ Device Response Generation Error\n',
        JSON.stringify(error, null, 2)
      );
      Alert.alert('❌ Device Response Generation Error', error.message);
    }
  };

  const handleGenerateResponseWrongDocRequested = async () => {
    try {
      await generateKeyIfNotExists(KEYTAG);
      const result = await ISO18013.generateOID4VPDeviceResponse(
        wrongDocRequest.request.clientId,
        wrongDocRequest.request.responseUri,
        wrongDocRequest.request.authorizationRequestNonce,
        wrongDocRequest.request.mdocGeneratedNonce,
        wrongDocRequest.documents,
        wrongDocRequest.fieldRequestedAndAccepted
      );
      console.log(result);
      Alert.alert('❌ Device Response Generation Success');
    } catch (error: any) {
      console.log(
        '✅ Device Response Generation Error\n',
        JSON.stringify(error, null, 2)
      );
      Alert.alert('✅ Device Response Generation Error', error.message);
    }
  };

  const handleGenerateResponseIncompleteDocRequested = async () => {
    try {
      await generateKeyIfNotExists(KEYTAG);
      const result = await ISO18013.generateOID4VPDeviceResponse(
        incompleteDocRequest.request.clientId,
        incompleteDocRequest.request.responseUri,
        incompleteDocRequest.request.authorizationRequestNonce,
        incompleteDocRequest.request.mdocGeneratedNonce,
        //Cast needed to induce error scenario
        incompleteDocRequest.documents as {
          alias: string;
          docType: string;
          issuerSignedContent: string;
        }[],
        incompleteDocRequest.fieldRequestedAndAccepted
      );
      console.log(result);
      Alert.alert('❌ Device Response Generation Success');
    } catch (error: any) {
      console.log(
        '✅ Device Response Generation Error\n',
        JSON.stringify(error, null, 2)
      );
      Alert.alert('✅ Device Response Generation Error', error.message);
    }
  };

  const handleGenerateResponseWrongFieldRequestedAndAccepted = async () => {
    try {
      await generateKeyIfNotExists(KEYTAG);
      const result = await ISO18013.generateOID4VPDeviceResponse(
        wrongFieldRequestedAndAccepted.request.clientId,
        wrongFieldRequestedAndAccepted.request.responseUri,
        wrongFieldRequestedAndAccepted.request.authorizationRequestNonce,
        wrongFieldRequestedAndAccepted.request.mdocGeneratedNonce,
        wrongFieldRequestedAndAccepted.documents,
        wrongFieldRequestedAndAccepted.fieldRequestedAndAccepted
      );
      console.log(result);
      Alert.alert('❌ Device Response Generation Success');
    } catch (error: any) {
      console.log(
        '✅ Device Response Generation Error\n',
        JSON.stringify(error, null, 2)
      );
      Alert.alert('✅ Device Response Generation Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.label}>CBOR</Text>
        <Button title="Decode MDL" onPress={handleDecode(mdlCbor)} />
        <Button
          title="Decode multiple docs"
          onPress={handleDecode(moreDocsCbor)}
        />
        <Button
          title="Decode multiple docs with issuer auth"
          onPress={handleDecode(moreDocsIssuerAuthCbor)}
        />
        <Button
          title="Decode issuer signed from single doc with decoded issuer auth"
          onPress={handleDecodeIssuerSigned(oneDocIssuerAuth)}
        />
        <Button title="Decode single doc" onPress={handleDecode(oneDocCbor)} />
        <Text style={styles.label}>COSE</Text>
        <Button title="Test sign" onPress={handleTestSign} />
        <Button title="Test verify" onPress={handleTestVerify} />
        <Text style={styles.label}>ISO18013</Text>
        <Button
          title="Test Generate OID4VP Response"
          onPress={handleGenerateResponse}
        />
        <Button
          title="Test Generate OID4VP Response (wrong DocRequested)"
          onPress={handleGenerateResponseWrongDocRequested}
        />
        <Button
          title="Test Generate OID4VP Response (incomplete DocRequested)"
          onPress={handleGenerateResponseIncompleteDocRequested}
        />
        <Button
          title="Test Generate OID4VP Response (wrong FieldsRequestedAndAccepted)"
          onPress={handleGenerateResponseWrongFieldRequestedAndAccepted}
        />
      </View>
    </SafeAreaView>
  );
}
