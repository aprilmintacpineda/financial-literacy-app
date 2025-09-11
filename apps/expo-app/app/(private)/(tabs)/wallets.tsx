import { MaterialIcons } from '@expo/vector-icons';
import { type EditWalletDto } from '@packages/data-transfer-objects/dtos';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../components/button';
import { useAuthContext } from '../../../contexts/auth';
import { trpc } from '../../../utils/trpc';

export default function WalletsTab () {
  const { activeOrganization } = useAuthContext(true);
  const { data, status, refetch, isRefetching } =
    trpc.getWalletsQuery.useQuery({
      organizationId: activeOrganization.id,
    });

  return (
    <SafeAreaView edges={['top']} className="flex-1">
      <FlatList
        ListFooterComponent={
          status === 'success' ? (
            <View className="p-2 pb-4">
              <Button label="Add wallet" href="/add-wallet" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          status === 'success' ? (
            <View className="flex-1 items-center justify-center p-5">
              <Text className="text-center">
                You have no wallets
              </Text>
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            onRefresh={refetch}
            refreshing={status === 'pending' || isRefetching}
          />
        }
        data={data || []}
        renderItem={({ item }) => {
          const {
            amount,
            name,
            currency,
            walletType,
            id,
            organizationId,
          } = item;

          return (
            <View
              key={id}
              className="m-2 gap-1 rounded-md border border-borders bg-white p-4"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="text-xl">{name}</Text>
                  <Text className="text-sm text-disabled-text">
                    {walletType}
                  </Text>
                </View>
                <Button
                  icon={
                    <MaterialIcons
                      name="edit"
                      size={15}
                      color="#fff"
                    />
                  }
                  className="rounded-full p-2"
                  href={{
                    pathname: '/edit-wallet',
                    params: {
                      id,
                      name,
                      organizationId,
                    } satisfies EditWalletDto,
                  }}
                />
              </View>
              <Text className="text-xl font-medium">
                {new Intl.NumberFormat(undefined, {
                  currency: currency,
                  style: 'currency',
                }).format(amount)}
              </Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
