import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';
import { useAuthContext } from '../../../contexts/auth';
import { useThemeColors } from '../../../themes';

export default function AccountTab () {
  const themeColors = useThemeColors();
  const { publicUserData, activeOrganization } =
    useAuthContext(true);

  return (
    <SafeAreaView>
      <View className="bg-disabled-border p-2">
        <Text className="font-bold">Your account</Text>
      </View>
      <View className="border-b border-b-borders">
        <Link href="/change-account-details">
          <View className="p-5">
            <Text>Edit account details</Text>
          </View>
        </Link>
      </View>
      <View className="border-b border-b-borders">
        <Link href="/change-password">
          <View className="p-5">
            <Text>Change password</Text>
          </View>
        </Link>
      </View>
      <View className="bg-disabled-border p-2">
        <Text className="font-bold">Your Teams</Text>
      </View>
      {publicUserData.organizations.map(organization => {
        const isActiveOrg =
          activeOrganization.id === organization.id;

        return (
          <View
            className="border-b border-b-borders"
            key={organization.id}
          >
            <TouchableOpacity>
              <View
                className={twMerge(
                  'flex-row items-center gap-2 p-5',
                  isActiveOrg ? 'bg-primary' : '',
                )}
              >
                {isActiveOrg && (
                  <MaterialIcons
                    name="check"
                    size={20}
                    color={
                      themeColors['--color-primary-contrast-text']
                    }
                  />
                )}
                <Text
                  className={twMerge(
                    isActiveOrg ? 'text-primary-contrast-text' : '',
                  )}
                >
                  {organization.name}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
      <View className="bg-disabled-border p-2">
        <Text className="font-bold">Others</Text>
      </View>
      <View className="border-b border-b-borders">
        <Link href="/tutorial">
          <View className="p-5">
            <Text>Tutorial</Text>
          </View>
        </Link>
      </View>
    </SafeAreaView>
  );
}
