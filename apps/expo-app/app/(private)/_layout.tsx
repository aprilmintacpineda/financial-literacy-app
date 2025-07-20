import { Stack } from 'expo-router';
import { useThemeColors } from '../../themes';

export default function PrivateLayout () {
  const themeColors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors['--color-primary'],
        },
        headerTitleStyle: {
          color: themeColors['--color-primary-contrast-text'],
        },
      }}
    >
      <Stack.Screen name="transactions" />
    </Stack>
  );
}
