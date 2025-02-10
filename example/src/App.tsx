import { CBOR, COSE } from '@pagopa/io-react-native-cbor';
import {
  deleteKey,
  generate,
  getPublicKey,
} from '@pagopa/io-react-native-crypto';
import * as RNDocuments from '@react-native-documents/picker';
import { Alert, Button, SafeAreaView, Text, View } from 'react-native';
import * as RNFS from 'react-native-fs';
import { styles } from './styles';

const KEYTAG = 'TEST_KEYTAG';

// PID CBOR object, base64 encoded
const DATA_TO_SIGN =
  'omdkb2NUeXBld2V1LmV1cm9wYS5lYy5ldWRpLnBpZC4xam5hbWVTcGFjZXOhd2V1LmV1cm9wYS5lYy5ldWRpLnBpZC4xuCRrZmFtaWx5X25hbWX0amdpdmVuX25hbWX0amJpcnRoX2RhdGX0a2FnZV9vdmVyXzE49GthZ2Vfb3Zlcl8xM/RrYWdlX292ZXJfMTb0a2FnZV9vdmVyXzIx9GthZ2Vfb3Zlcl82MPRrYWdlX292ZXJfNjX0a2FnZV9vdmVyXzY49GxhZ2VfaW5feWVhcnP0bmFnZV9iaXJ0aF95ZWFy9HFmYW1pbHlfbmFtZV9iaXJ0aPRwZ2l2ZW5fbmFtZV9iaXJ0aPRrYmlydGhfcGxhY2X0bWJpcnRoX2NvdW50cnn0a2JpcnRoX3N0YXRl9GpiaXJ0aF9jaXR59HByZXNpZGVudF9hZGRyZXNz9HByZXNpZGVudF9jb3VudHJ59G5yZXNpZGVudF9zdGF0ZfRtcmVzaWRlbnRfY2l0efR0cmVzaWRlbnRfcG9zdGFsX2NvZGX0b3Jlc2lkZW50X3N0cmVldPR1cmVzaWRlbnRfaG91c2VfbnVtYmVy9GZnZW5kZXL0a25hdGlvbmFsaXR59G1pc3N1YW5jZV9kYXRl9GtleHBpcnlfZGF0ZfRxaXNzdWluZ19hdXRob3JpdHn0b2RvY3VtZW50X251bWJlcvR1YWRtaW5pc3RyYXRpdmVfbnVtYmVy9G9pc3N1aW5nX2NvdW50cnn0dGlzc3VpbmdfanVyaXNkaWN0aW9u9Ghwb3J0cmFpdPR1cG9ydHJhaXRfY2FwdHVyZV9kYXRl9A==';
// Signed PID CBOR object, base64 encoded
const DATA_TO_VERIFY =
  'hEOhASZBoFkCdKJnZG9jVHlwZXdldS5ldXJvcGEuZWMuZXVkaS5waWQuMWpuYW1lU3BhY2VzoXdldS5ldXJvcGEuZWMuZXVkaS5waWQuMbgka2ZhbWlseV9uYW1l9GpnaXZlbl9uYW1l9GpiaXJ0aF9kYXRl9GthZ2Vfb3Zlcl8xOPRrYWdlX292ZXJfMTP0a2FnZV9vdmVyXzE29GthZ2Vfb3Zlcl8yMfRrYWdlX292ZXJfNjD0a2FnZV9vdmVyXzY19GthZ2Vfb3Zlcl82OPRsYWdlX2luX3llYXJz9G5hZ2VfYmlydGhfeWVhcvRxZmFtaWx5X25hbWVfYmlydGj0cGdpdmVuX25hbWVfYmlydGj0a2JpcnRoX3BsYWNl9G1iaXJ0aF9jb3VudHJ59GtiaXJ0aF9zdGF0ZfRqYmlydGhfY2l0efRwcmVzaWRlbnRfYWRkcmVzc/RwcmVzaWRlbnRfY291bnRyefRucmVzaWRlbnRfc3RhdGX0bXJlc2lkZW50X2NpdHn0dHJlc2lkZW50X3Bvc3RhbF9jb2Rl9G9yZXNpZGVudF9zdHJlZXT0dXJlc2lkZW50X2hvdXNlX251bWJlcvRmZ2VuZGVy9GtuYXRpb25hbGl0efRtaXNzdWFuY2VfZGF0ZfRrZXhwaXJ5X2RhdGX0cWlzc3VpbmdfYXV0aG9yaXR59G9kb2N1bWVudF9udW1iZXL0dWFkbWluaXN0cmF0aXZlX251bWJlcvRvaXNzdWluZ19jb3VudHJ59HRpc3N1aW5nX2p1cmlzZGljdGlvbvRocG9ydHJhaXT0dXBvcnRyYWl0X2NhcHR1cmVfZGF0ZfRYSDBGAiEAqPAo2u2Sykg8jcuLnW0C8Xd1ERGi9g6atC0J53GQ3PkCIQDZy2D1TkvGCv712255TA4ub9hM0tXMab49IU3I8I69Xw==';

export default function App() {
  const handleSelectInput = async () => {
    const [result] = await RNDocuments.pick({
      mode: 'open',
      type: [RNDocuments.types.plainText],
    });
    try {
      const data = await RNFS.readFile(result.uri, 'utf8');
      const decoded = await CBOR.decodeDocuments(data);
      Alert.alert('✅ Decode Success', JSON.stringify(decoded, null, 2));
    } catch (error: any) {
      Alert.alert('❌ Decode Error', error.message);
    }
  };

  const handleTestSign = async () => {
    try {
      await deleteKey(KEYTAG);
      await generate(KEYTAG);
      const result = await COSE.sign(DATA_TO_SIGN, KEYTAG);
      Alert.alert('✅ Sign Success', JSON.stringify(result, null, 2));
    } catch (error: any) {
      Alert.alert('❌ Sign Error', error.message);
    }
  };

  const handleTestVerify = async () => {
    try {
      const publicKey = await getPublicKey(KEYTAG);
      console.log('🔑 Public Key', publicKey);
      const result = await COSE.verify(DATA_TO_VERIFY, publicKey);
      if (result) {
        Alert.alert('✅ Verify Success');
      } else {
        Alert.alert('❌ Verify Error');
      }
    } catch (error: any) {
      Alert.alert('❌ Verify Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.label}>CBOR</Text>
        <Button title="Decode from file" onPress={handleSelectInput} />
        <Text style={styles.label}>COSE</Text>
        <Button title="Test sign" onPress={handleTestSign} />
        <Button title="Test verify" onPress={handleTestVerify} />
      </View>
    </SafeAreaView>
  );
}
