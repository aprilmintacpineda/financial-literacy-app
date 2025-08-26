import { Stack } from 'expo-router';
import { useThemeColors } from '../../themes';

export default function PrivateStackRoutes () {
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
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="change-account-details"
        options={{
          title: 'Change Account Details',
        }}
      />
      <Stack.Screen
        name="add-wallet"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="edit-wallet"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="add-category"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="edit-category"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="add-tag"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="edit-tag"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
