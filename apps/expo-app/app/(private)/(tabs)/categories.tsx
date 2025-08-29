import { MaterialIcons } from '@expo/vector-icons';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../components/button';
import { useAuthContext } from '../../../contexts/auth';
import { trpc } from '../../../utils/trpc';

export default function CategoriesTab () {
  const { activeOrganization } = useAuthContext(true);
  const { data, status, refetch, isRefetching } =
    trpc.getCategoriesQuery.useQuery({
      organizationId: activeOrganization.id,
    });

  return (
    <SafeAreaView edges={['top']} className="flex-1">
      <FlatList
        ListFooterComponent={
          status === 'success' ? (
            <View className="p-2 pb-4">
              <Button label="Add Category" href="/add-category" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          status === 'success' ? (
            <View className="flex-1 items-center justify-center p-5">
              <Text className="text-center">
                You have no categories
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
          const { id, name, description } = item;

          return (
            <View
              key={id}
              className="m-2 gap-1 rounded-md border border-borders bg-white p-4"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="text-xl">{name}</Text>
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
                    pathname: '/edit-category',
                    params: {
                      id: item.id,
                      description: item.description,
                      name: item.name,
                    },
                  }}
                />
              </View>
              {description && <Text>{description}</Text>}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
