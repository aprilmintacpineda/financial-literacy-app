import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';
import Button from '../../../components/button';
import { useAuthContext } from '../../../contexts/auth';
import { useThemeColors } from '../../../themes';
import { trpc } from '../../../utils/trpc';

export type EditTransactionParam = {
  id: string;
};

export default function TransactionsTab () {
  const { activeOrganization } = useAuthContext(true);
  const colors = useThemeColors();

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
            fromWallet,
            tags,
            transactionDate,
            transactionType,
          },
        }) => {
          const isExpense = transactionType === 'Expense';
          const isIncome = transactionType === 'Income';

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
                        : isIncome
                          ? 'text-success-text'
                          : '',
                    )}
                  >
                    {isExpense ? '-' : isIncome ? '+' : '~'}
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
                    params: { id } satisfies EditTransactionParam,
                  }}
                />
              </View>
              {description && (
                <Text className="text-sm" numberOfLines={1}>
                  {description}
                </Text>
              )}
              {transactionType === 'Repayment' ||
              transactionType === 'Transfer' ? (
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm">{fromWallet!.name}</Text>
                  <MaterialIcons
                    name="arrow-right-alt"
                    size={15}
                    color={colors['--color-primary']}
                  />
                  <Text className="text-sm">{wallet.name}</Text>
                </View>
              ) : (
                <View className="flex-row items-center gap-3">
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons
                      name="wallet"
                      color={colors['--color-primary']}
                      size={15}
                    />
                    <Text className="text-sm">{wallet.name}</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons
                      name="category"
                      color={colors['--color-primary']}
                      size={15}
                    />
                    <Text className="text-sm">{category!.name}</Text>
                  </View>
                </View>
              )}
              <View className="flex-row items-center gap-1">
                {tags.map(tag => {
                  return (
                    <View
                      key={tag.id}
                      className="flex-row items-center"
                    >
                      <MaterialIcons
                        name="tag"
                        color={colors['--color-primary']}
                        size={15}
                      />
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
