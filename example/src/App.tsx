import { CBOR, COSE } from '@pagopa/io-react-native-cbor';
import { deleteKey, generate } from '@pagopa/io-react-native-crypto';
import * as RNDocuments from '@react-native-documents/picker';
import { Alert, Button, SafeAreaView, Text, View } from 'react-native';
import * as RNFS from 'react-native-fs';
import { styles } from './styles';

export const KEYTAG = 'TEST_KEYTAG';

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
      const result = await COSE.sign('VGVzdCB0ZXN0', KEYTAG);
      Alert.alert('✅ Sign Success', JSON.stringify(result, null, 2));
    } catch (error: any) {
      Alert.alert('❌ Sign Error', error.message);
    }
  };

  const handleTestVerify = async () => {
    try {
      const result = await COSE.verify(
        'hEOhASZBoEVoZWxsb1hHMEUCIQC06Stj/TKM5gbhwAb4SC4sz22J9ZkMMOCQ3bq3HcIifgIgY/YZy7ya3I8I52jXfy/EhbWAl83/kH0vsGIkUb2YBDM=',
        'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEr6rRg9G4SDg0i8W1DBKSvk9wMlhumqTF353H2CmrycKClwgwErIY+COCVrpF6JH9k0vnOJUhtItPv2uMMo11yQ=='
      );
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
