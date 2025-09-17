import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import Button from '../../components/button';
import { useAuthContext } from '../../contexts/auth';
import { useThemeColors } from '../../themes';
import { alertDialog } from '../../utils/alerts';
import { trpc, type TRPCProcedureOutputs } from '../../utils/trpc';

export type EditTransactionParam = {
  id: string;
};

interface Props {
  transaction: TRPCProcedureOutputs['getTransactionsQuery'][number];
}

export default function TransactionRow ({ transaction }: Props) {
  const { activeOrganization } = useAuthContext(true);
  const colors = useThemeColors();
  const [isLoading, setIsLoading] = useState(false);
  const utils = trpc.useUtils();
  const { mutate } = trpc.deleteTransactionMutation.useMutation({
    onSuccess: () => {
      utils.getTransactionsQuery.invalidate();
    },
  });

  const {
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
  } = transaction;

  const deleteConfirmation = useCallback(() => {
    alertDialog({
      message:
        'Are you sure you want to delete that transaction?\n\nThis action cannot be undone.',
      onConfirm: async () => {
        setIsLoading(true);
        mutate({
          organizationId: activeOrganization.id,
          transactionId: id,
        });
      },
    });
  }, [id, activeOrganization.id]);

  const isExpense = transactionType === 'Expense';
  const isIncome = transactionType === 'Income';

  return (
    <View className="m-2 gap-1 rounded-md border border-borders bg-white p-4">
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
        {isLoading ? (
          <View className="p-2">
            <ActivityIndicator
              color={colors['--color-primary']}
              size={15}
            />
          </View>
        ) : (
          <View className="flex-row items-center justify-center gap-2">
            <Button
              icon={
                <MaterialIcons
                  name="delete-forever"
                  size={15}
                  color={colors['--color-error-text']}
                />
              }
              className="rounded-full bg-error-bg p-2"
              onPress={deleteConfirmation}
              isDisabled={isLoading}
            />
            <Button
              icon={
                <MaterialIcons name="edit" size={15} color="#fff" />
              }
              className="rounded-full p-2"
              href={{
                pathname: '/edit-transaction',
                params: { id } satisfies EditTransactionParam,
              }}
              isDisabled={isLoading}
            />
          </View>
        )}
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
            <View key={tag.id} className="flex-row items-center">
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
}
