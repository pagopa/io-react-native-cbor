import { useState } from 'react';
import { Button, SafeAreaView, Text, TextInput, View } from 'react-native';
import { styles } from '../utils/styles';

function DecodeScreen() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleDecodePress = () => {
    const decoded = input;
    setOutput(decoded);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.label}>Input</Text>
        <TextInput
          style={styles.input}
          multiline={true}
          value={input}
          onChangeText={setInput}
        />
        <Button title="Decode" onPress={handleDecodePress} />
        <Text style={styles.label}>Output</Text>
        <TextInput
          style={styles.input}
          multiline={true}
          value={output}
          editable={false}
        />
      </View>
    </SafeAreaView>
  );
}

export { DecodeScreen };
