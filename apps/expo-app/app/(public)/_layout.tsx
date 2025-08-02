import { Stack } from 'expo-router';
import { useThemeColors } from '../../themes';

export default function PublicLayout () {
  const themeColors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors['--color-primary'],
        },
        headerTintColor:
          themeColors['--color-primary-contrast-text'],
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="sign-up"
        options={{
          title: 'Sign Up',
        }}
      />
    </Stack>
  );
}
