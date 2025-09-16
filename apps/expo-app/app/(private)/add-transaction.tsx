import { zodResolver } from '@hookform/resolvers/zod';
import {
  type AddTransactionDto,
  addTransactionDto,
} from '@packages/data-transfer-objects/dtos';
import { supportedTransactionTypes } from '@packages/data-transfer-objects/enums';
import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import FormMultiSelectOptionsAsync from '../../components/forms/multi-select-options-async';
import FormNumberInput from '../../components/forms/number-input';
import FormSelectOptions from '../../components/forms/select-options';
import FormSelectOptionsAsync from '../../components/forms/select-options-async';
import FormSubmitButton from '../../components/forms/submit-button';
import FormTextInput from '../../components/forms/text-input';
import { useAuthContext } from '../../contexts/auth';
import { alertMessage, alertUknownError } from '../../utils/alerts';
import { trpc } from '../../utils/trpc';

const transactionTypeOptions = supportedTransactionTypes.map(
  value => {
    return {
      label: value,
      value,
    };
  },
);

export default function AddTransaction () {
  const { activeOrganization } = useAuthContext(true);
  const router = useRouter();

  const now = useMemo(() => new Date(), []);

  const { control, handleSubmit, watch, setValue } = useForm({
    resolver: zodResolver(addTransactionDto),
    values: {
      organizationId: activeOrganization.id,
      walletId: '',
      amount: 0,
      transactionDate: now,
      transactionType: 'Expense',
      tagIds: [],
      categoryId: '',
    } satisfies AddTransactionDto,
    mode: 'all',
  });

  const { mutateAsync } = trpc.addTransactionMutation.useMutation();

  const onSubmit = handleSubmit(async data => {
    try {
      await mutateAsync(data);
      router.dismissAll();
      alertMessage('Transaction added successfully');
    } catch (error) {
      console.log(error);
      // @todo log to sentry?
      alertUknownError();
    }
  });

  const getWalletsQuery = trpc.getWalletsQuery.useQuery({
    organizationId: activeOrganization.id,
  });

  const getCategoriesQuery = trpc.getCategoriesQuery.useQuery({
    organizationId: activeOrganization.id,
  });

  const transactionType = watch('transactionType');

  useEffect(() => {
    setValue('fromWalletId', '', { shouldValidate: true });
    setValue('categoryId', '', { shouldValidate: true });
  }, [transactionType]);

  const requireFromWallet =
    transactionType === 'Transfer' ||
    transactionType === 'Repayment';

  return (
    <View className="p-5">
      <FormTextInput
        control={control}
        name="description"
        label="Description"
      />
      <FormNumberInput
        control={control}
        name="amount"
        label="Amount"
      />
      <FormSelectOptions
        control={control}
        name="transactionType"
        label="Transaction Type"
        options={transactionTypeOptions}
      />
      {requireFromWallet && (
        <FormSelectOptionsAsync
          control={control}
          name="fromWalletId"
          label="From Wallet"
          queryResult={getWalletsQuery}
          mapDataToOptions={data => {
            return {
              label: data.name,
              value: data.id,
            };
          }}
        />
      )}
      <FormSelectOptionsAsync
        control={control}
        name="walletId"
        label={requireFromWallet ? 'To Wallet' : 'Wallet'}
        queryResult={getWalletsQuery}
        mapDataToOptions={data => {
          return {
            label: data.name,
            value: data.id,
          };
        }}
      />
      {!requireFromWallet && (
        <FormSelectOptionsAsync
          control={control}
          name="categoryId"
          label="Category"
          queryResult={getCategoriesQuery}
          mapDataToOptions={data => {
            return {
              label: data.name,
              value: data.id,
            };
          }}
        />
      )}
      <FormMultiSelectOptionsAsync
        control={control}
        name="tagIds"
        label="Tags"
        queryResult={trpc.getTagsQuery.useQuery({
          organizationId: activeOrganization.id,
        })}
        mapDataToOptions={data => {
          return {
            label: data.name,
            value: data.id,
          };
        }}
      />
      <FormSubmitButton
        control={control}
        label="Add Transaction"
        onPress={onSubmit}
      />
    </View>
  );
}
