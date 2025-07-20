import { vars } from 'nativewind';
import { type PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useThemeColors } from '../themes';

export default function Theme ({ children }: PropsWithChildren) {
  const themeColors = useThemeColors();

  return (
    <View style={[vars(themeColors), { flex: 1 }]}>{children}</View>
  );
}
