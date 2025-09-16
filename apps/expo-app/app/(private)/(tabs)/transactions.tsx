import { MaterialIcons } from '@expo/vector-icons';
import { type EditTransactionDto } from '@packages/data-transfer-objects/dtos';
import { Link } from 'expo-router';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';
import Button from '../../../components/button';
import { useAuthContext } from '../../../contexts/auth';
import { trpc } from '../../../utils/trpc';

export type EditTransactionParam = Omit<
  EditTransactionDto,
  'transactionDate' | 'tagIds' | 'description' | 'amount'
> & {
  transactionDate: string;
  tagIds: string;
  description: string;
  amount: string;
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
        renderItem={({
          item: {
            id,
            amount,
            description,
            currency,
            category,
            wallet,
            tags,
            transactionDate,
            transactionType,
            organizationId,
          },
        }) => {
          const isExpense = transactionType === 'Expense';

          return (
            <View
              key={id}
              className="m-2 gap-1 rounded-md border border-borders bg-white p-4"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Text
                    className={twMerge(
                      'text-xl font-medium',
                      isExpense
                        ? 'text-error-text'
                        : 'text-success-text',
                    )}
                  >
                    {isExpense ? '-' : '+'}
                    {new Intl.NumberFormat(undefined, {
                      currency,
                      style: 'currency',
                    }).format(amount)}
                  </Text>
                  <Text className="text-sm text-disabled-text">
                    {new Intl.DateTimeFormat(undefined, {
                      dateStyle: 'medium',
                    }).format(transactionDate)}
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
                    pathname: '/edit-transaction',
                    params: {
                      amount: amount.toString(),
                      currency,
                      description,
                      transactionDate: transactionDate.toISOString(),
                      categoryId: category.id,
                      organizationId,
                      tagIds: tags.map(tag => tag.id).join(','),
                      id,
                      transactionType,
                      walletId: wallet.id,
                    } satisfies EditTransactionParam,
                  }}
                />
              </View>
              {description && (
                <Text className="text-sm" numberOfLines={1}>
                  {description}
                </Text>
              )}
              <Text className="text-sm" numberOfLines={1}>
                {wallet.name} | {category.name}
              </Text>
              <View className="flex-row items-center gap-2">
                {tags.map(tag => {
                  return (
                    <View
                      key={tag.id}
                      className="border-hairline rounded-full border-primary-border px-1"
                    >
                      <Text className="text-sm text-primary">
                        {tag.name}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
