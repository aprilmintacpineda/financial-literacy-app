import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useThemeColors } from '../../../themes';

export default function PrivateTabRoutes () {
  const themeColors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        tabBarBackground: () => (
          <View className="flex-1 bg-primary" />
        ),
        headerShown: false,
        tabBarActiveTintColor:
          themeColors['--color-primary-contrast-text'],
        tabBarInactiveBackgroundColor:
          themeColors['--color-primary'],
      }}
    >
      <Tabs.Screen
        name="transactions"
        options={{
          tabBarLabel: 'Transactions',
          tabBarIcon: props => (
            <MaterialIcons name="list-alt" {...props} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallets"
        options={{
          tabBarLabel: 'Wallets',
          tabBarIcon: props => (
            <MaterialIcons name="wallet" {...props} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: props => (
            <MaterialIcons name="category" {...props} />
          ),
        }}
      />
      <Tabs.Screen
        name="tags"
        options={{
          tabBarLabel: 'Tags',
          tabBarIcon: props => (
            <MaterialIcons name="tag" {...props} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: props => (
            <MaterialIcons name="person" {...props} />
          ),
        }}
      />
    </Tabs>
  );
}
