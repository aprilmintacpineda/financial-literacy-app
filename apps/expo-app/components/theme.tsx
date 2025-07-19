import { useColorScheme } from 'nativewind';
import { type PropsWithChildren } from 'react';
import { View } from 'react-native';
import themes from '../themes';

export default function Theme ({ children }: PropsWithChildren) {
  const { colorScheme } = useColorScheme();

  return (
    <View style={[themes[colorScheme ?? 'light'], { flex: 1 }]}>
      {children}
    </View>
  );
}
