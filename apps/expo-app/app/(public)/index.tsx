import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { trpc } from '../../utils/trpc';

export default function HomeScreen () {
  const { data, status } = trpc.greetQuery.useQuery('World');

  if (status === 'pending') {
    return (
      <SafeAreaView
        style={[
          StyleSheet.absoluteFill,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <Text>{data}</Text>
    </SafeAreaView>
  );
}
