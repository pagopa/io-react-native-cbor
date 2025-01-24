import * as CBOR from '@pagopa/io-react-native-cbor';
import * as RNDocuments from '@react-native-documents/picker';
import { Alert, Button, SafeAreaView, Text, View } from 'react-native';
import * as RNFS from 'react-native-fs';
import { styles } from './styles';

export default function App() {
  const handleSelectInput = async () => {
    const [result] = await RNDocuments.pick({
      mode: 'open',
      type: [RNDocuments.types.plainText],
    });
    const data = await RNFS.readFile(result.uri, 'utf8');
    CBOR.decodeDocuments(data)
      .then((decoded) => {
        Alert.alert('✅ Decode Success', JSON.stringify(decoded, null, 2));
      })
      .catch((error) => {
        Alert.alert('❌ Decode Error', error.message);
      });
  };

  const handleTestSign = async () => {
    const { signature, publicKey } = await CBOR.sign(
      'VGVzdCB0ZXN0',
      'testAlias'
    );
    console.log('signedData', signature);
    console.log('publicKey', publicKey);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.label}>CBOR</Text>
        <Button title="Decode from file" onPress={handleSelectInput} />
        <Text style={styles.label}>COSE</Text>
        <Button title="Test sign" onPress={handleTestSign} />
      </View>
    </SafeAreaView>
  );
}
