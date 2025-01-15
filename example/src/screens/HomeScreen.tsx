import { useNavigation } from '@react-navigation/native';
import { Button, View } from 'react-native';

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Verify" onPress={() => navigation.navigate('Verify')} />
      <Button title="Decode" onPress={() => navigation.navigate('Decode')} />
    </View>
  );
}

export { HomeScreen };
