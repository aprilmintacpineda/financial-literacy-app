import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../components/button';

export default function WalletsTab () {
  return (
    <SafeAreaView>
      <Text>WalletsTab</Text>
      <Button label="Add wallet" href="/add-wallet" />
    </SafeAreaView>
  );
}
