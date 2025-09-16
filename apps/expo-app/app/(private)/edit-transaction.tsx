import { zodResolver } from '@hookform/resolvers/zod';
import {
  type EditExpenseOrIncomeTransactionDto,
  editTransactionDto,
  type EditTransferOrRepaymentTransactionDto,
} from '@packages/data-transfer-objects/dtos';
import { supportedTransactionTypes } from '@packages/data-transfer-objects/enums';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, View } from 'react-native';
import FormMultiSelectOptionsAsync from '../../components/forms/multi-select-options-async';
import FormNumberInput from '../../components/forms/number-input';
import FormSelectOptions from '../../components/forms/select-options';
import FormSelectOptionsAsync from '../../components/forms/select-options-async';
import FormSubmitButton from '../../components/forms/submit-button';
import FormTextInput from '../../components/forms/text-input';
import { useAuthContext } from '../../contexts/auth';
import { alertMessage, alertUknownError } from '../../utils/alerts';
import { trpc } from '../../utils/trpc';
import { type EditTransactionParam } from './(tabs)/transactions';

const transactionTypeOptions = supportedTransactionTypes.map(
  value => {
    return {
      label: value,
      value,
    };
  },
);

export default function EditTransaction () {
  const { activeOrganization } = useAuthContext(true);
  const router = useRouter();
  const { id } = useLocalSearchParams<EditTransactionParam>();
  const trpcUtils = trpc.useUtils();
  const wasLoading = useRef(true);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isLoading },
    subscribe,
  } = useForm({
    resolver: zodResolver(editTransactionDto),
    mode: 'all',
    defaultValues: async () => {
      const response = await trpcUtils.getTransactionByIdQuery.fetch(
        {
          organizationId: activeOrganization.id,
          transactionId: id,
        },
      );

      if (
        response.transactionType === 'Repayment' ||
        response.transactionType === 'Transfer'
      ) {
        return {
          id: response.id,
          amount: response.amount,
          description: response.description,
          transactionDate: response.transactionDate,
          transactionType: response.transactionType,
          walletId: response.wallet.id,
          fromWalletId: response.fromWalletId!,
          tagIds: response.tags.map(tag => tag.id),
          exchangeRate: response.exchangeRate,
          organizationId: response.organizationId,
        } satisfies EditTransferOrRepaymentTransactionDto;
      }

      return {
        id: response.id,
        amount: response.amount,
        description: response.description,
        transactionDate: response.transactionDate,
        transactionType: response.transactionType,
        walletId: response.wallet.id,
        categoryId: response.categoryId!,
        tagIds: response.tags.map(tag => tag.id),
        exchangeRate: response.exchangeRate,
        organizationId: response.organizationId,
      } satisfies EditExpenseOrIncomeTransactionDto;
    },
  });

  const { mutateAsync } = trpc.editTransactionMutation.useMutation();

  const onSubmit = handleSubmit(async data => {
    try {
      await mutateAsync(data);
      router.dismissAll();
      alertMessage('Transaction updated successfully');
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

  const getTagsQuery = trpc.getTagsQuery.useQuery({
    organizationId: activeOrganization.id,
  });

  const transactionType = watch('transactionType');

  useEffect(() => {
    return subscribe({
      name: 'transactionType',
      callback: () => {
        if (wasLoading.current) {
          wasLoading.current = false;
          return;
        }

        setValue('fromWalletId', '', { shouldValidate: true });
        setValue('categoryId', '', { shouldValidate: true });
      },
    });
  }, [subscribe]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center pt-20">
        <ActivityIndicator size={15} />
      </View>
    );
  }

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
        isDisabled
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
        queryResult={getTagsQuery}
        mapDataToOptions={data => {
          return {
            label: data.name,
            value: data.id,
          };
        }}
      />
      <FormSubmitButton
        control={control}
        label="Save changes"
        onPress={onSubmit}
      />
    </View>
  );
}
