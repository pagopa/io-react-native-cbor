import * as RNCBOR from '@pagopa/io-react-native-cbor';
import * as RNDocuments from '@react-native-documents/picker';
import { useState } from 'react';
import { Alert, Button, SafeAreaView, Text, View } from 'react-native';
import * as RNFS from 'react-native-fs';
import { styles } from './styles';

export default function App() {
  const [signature, setSignature] = useState<RNCBOR.COSESignResult>();

  const handleSelectInput = async () => {
    const [result] = await RNDocuments.pick({
      mode: 'open',
      type: [RNDocuments.types.plainText],
    });
    try {
      const data = await RNFS.readFile(result.uri, 'utf8');
      const decoded = await RNCBOR.decodeDocuments(data);
      Alert.alert('✅ Decode Success', JSON.stringify(decoded, null, 2));
    } catch (error: any) {
      Alert.alert('❌ Decode Error', error.message);
    }
  };

  const handleTestSign = async () => {
    try {
      const result = await RNCBOR.sign('VGVzdCB0ZXN0', 'testAlias');
      setSignature(result);
      Alert.alert('✅ Sign Success', JSON.stringify(result, null, 2));
    } catch (error: any) {
      Alert.alert('❌ Sign Error', error.message);
    }
  };

  const handleTestVerify = async () => {
    if (signature) {
      try {
        const result = await RNCBOR.verify(
          signature.dataSigned,
          signature.publicKey
        );
        Alert.alert('✅ Verify Success', JSON.stringify(result, null, 2));
      } catch (error: any) {
        Alert.alert('❌ Verify Error', error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.label}>CBOR</Text>
        <Button title="Decode from file" onPress={handleSelectInput} />
        <Text style={styles.label}>COSE</Text>
        <Button title="Test sign" onPress={handleTestSign} />
        {signature && <Button title="Test verify" onPress={handleTestVerify} />}
      </View>
    </SafeAreaView>
  );
}
