import * as CBOR from '@pagopa/io-react-native-cbor';
import * as RNDocuments from '@react-native-documents/picker';
import { useState } from 'react';
import { Button, SafeAreaView, ScrollView, Text, View } from 'react-native';
import * as RNFS from 'react-native-fs';
import { styles } from './styles';

export default function App() {
  const [input, setInput] = useState<string | undefined>(undefined);
  const [output, setOutput] = useState<string | undefined>(undefined);

  const handleSelectInput = async () => {
    const [result] = await RNDocuments.pick({
      mode: 'open',
      type: [RNDocuments.types.plainText],
    });
    const data = await RNFS.readFile(result.uri, 'utf8');
    setInput(data);
  };

  const handleDecodePress = async () => {
    if (input) {
      CBOR.decode(input)
        .then((decoded) => {
          console.log('decoded', decoded);
          setOutput(JSON.stringify(decoded, null, 2));
        })
        .catch((error) => {
          setOutput(error);
        });
    }
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
      <ScrollView>
        <View style={styles.container}>
          <Button title="Test sign" onPress={handleTestSign} />
          <Button title="Select input" onPress={handleSelectInput} />
          {input && (
            <>
              <Button title="Decode" onPress={handleDecodePress} />
              <Text style={styles.label}>Output</Text>
              <Text>{output}</Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
