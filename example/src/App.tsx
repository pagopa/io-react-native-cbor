import { CBOR, COSE } from '@pagopa/io-react-native-cbor';
import {
  generate,
  getPublicKey,
  PublicKey,
} from '@pagopa/io-react-native-crypto';
import { Alert, Button, SafeAreaView, Text, View } from 'react-native';
import mdlCbor from './mocks/mdl';
import moreDocsCbor from './mocks/moreDocs';
import moreDocsIssuerAuthCbor from './mocks/moreDocsIssuerAuth';
import oneDocCbor from './mocks/oneDoc';
import { styles } from './styles';

const KEYTAG = 'TEST_KEYTAG';

// PID CBOR object, base64 encoded
const DATA_TO_SIGN =
  'omdkb2NUeXBld2V1LmV1cm9wYS5lYy5ldWRpLnBpZC4xam5hbWVTcGFjZXOhd2V1LmV1cm9wYS5lYy5ldWRpLnBpZC4xuCRrZmFtaWx5X25hbWX0amdpdmVuX25hbWX0amJpcnRoX2RhdGX0a2FnZV9vdmVyXzE49GthZ2Vfb3Zlcl8xM/RrYWdlX292ZXJfMTb0a2FnZV9vdmVyXzIx9GthZ2Vfb3Zlcl82MPRrYWdlX292ZXJfNjX0a2FnZV9vdmVyXzY49GxhZ2VfaW5feWVhcnP0bmFnZV9iaXJ0aF95ZWFy9HFmYW1pbHlfbmFtZV9iaXJ0aPRwZ2l2ZW5fbmFtZV9iaXJ0aPRrYmlydGhfcGxhY2X0bWJpcnRoX2NvdW50cnn0a2JpcnRoX3N0YXRl9GpiaXJ0aF9jaXR59HByZXNpZGVudF9hZGRyZXNz9HByZXNpZGVudF9jb3VudHJ59G5yZXNpZGVudF9zdGF0ZfRtcmVzaWRlbnRfY2l0efR0cmVzaWRlbnRfcG9zdGFsX2NvZGX0b3Jlc2lkZW50X3N0cmVldPR1cmVzaWRlbnRfaG91c2VfbnVtYmVy9GZnZW5kZXL0a25hdGlvbmFsaXR59G1pc3N1YW5jZV9kYXRl9GtleHBpcnlfZGF0ZfRxaXNzdWluZ19hdXRob3JpdHn0b2RvY3VtZW50X251bWJlcvR1YWRtaW5pc3RyYXRpdmVfbnVtYmVy9G9pc3N1aW5nX2NvdW50cnn0dGlzc3VpbmdfanVyaXNkaWN0aW9u9Ghwb3J0cmFpdPR1cG9ydHJhaXRfY2FwdHVyZV9kYXRl9A==';

// COSE object with payload `this is test data`
const DATA_TO_VERIFY =
  'hEOhASagUXRoaXMgaXMgdGVzdCBkYXRhWECWHFXxcZPkyupozacO5KTeBDcbXFYX6HaFynTZ85qXdtGGd9bhtgBq1vcjYdK0QHP+DmG15108cm497i83ScSf';

const TEST_KEY: PublicKey = {
  crv: 'P-256',
  kty: 'EC',
  x: 'RjbyQJnEKZuBIQ71mLMVs0+y5uzdEe1+pALMMoucqlQ=',
  y: 'hlVFni6N2sqKY6XK3KGmqU4m7Y+U606ElJKRvNQ0nH4=',
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
      Alert.alert('✅ CBOR Decode Success', JSON.stringify(decoded, null, 2));
    } catch (error: any) {
      console.log('❌ CBOR Decode Error\n', JSON.stringify(error, null, 2));
      Alert.alert('❌ CBOR Decode Error');
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
        <Button title="Decode single doc" onPress={handleDecode(oneDocCbor)} />
        <Text style={styles.label}>COSE</Text>
        <Button title="Test sign" onPress={handleTestSign} />
        <Button title="Test verify" onPress={handleTestVerify} />
      </View>
    </SafeAreaView>
  );
}
