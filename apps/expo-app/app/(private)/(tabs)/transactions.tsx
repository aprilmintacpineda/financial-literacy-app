import { Link } from 'expo-router';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../components/button';
import TransactionRow from '../../../components/transactions/row';
import { useAuthContext } from '../../../contexts/auth';
import { trpc } from '../../../utils/trpc';

export type EditTransactionParam = {
  id: string;
};

export default function TransactionsTab () {
  const { activeOrganization } = useAuthContext(true);

  const { refetch, data, status, isRefetching } =
    trpc.getTransactionsQuery.useQuery({
      organizationId: activeOrganization.id,
    });

  return (
    <SafeAreaView edges={['top']} className="flex-1">
      <FlatList
        ListFooterComponent={
          status === 'success' ? (
            <View className="p-2 pb-4">
              <Button
                label="Add Transaction"
                href="/add-transaction"
              />
            </View>
          ) : null
        }
        ListEmptyComponent={
          status === 'success' ? (
            <View className="flex-1 items-center justify-center p-5">
              <Text className="mb-2 text-center">
                You have no transactions
              </Text>
              <Text className="mb-2">
                Make sure you have at least{' '}
                <Text className="font-bold">1 wallet</Text> and{' '}
                <Text className="font-bold">1 category</Text>.
              </Text>
              <Text className="text-center">
                If you're just getting started, check out the{' '}
                <Link
                  href="/(private)/tutorial"
                  className="text-primary underline"
                >
                  tutorials
                </Link>{' '}
                to learn the basics.
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
        renderItem={({ item: transaction }) => (
          <TransactionRow
            key={transaction.id}
            transaction={transaction}
          />
        )}
      />
    </SafeAreaView>
  );
}
