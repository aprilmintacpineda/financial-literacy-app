import { zodResolver } from '@hookform/resolvers/zod';
import {
  type EditTransactionDto,
  editTransactionDto,
} from '@packages/data-transfer-objects/dtos';
import {
  currenciesOptions,
  supportedTransactionTypes,
} from '@packages/data-transfer-objects/enums';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  const {
    id,
    organizationId,
    amount,
    categoryId,
    currency,
    tagIds,
    transactionDate,
    transactionType,
    walletId,
    description,
  } = useLocalSearchParams<EditTransactionParam>();

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(editTransactionDto),
    values: {
      id,
      organizationId,
      categoryId,
      walletId,
      amount: Number(amount),
      currency,
      description,
      transactionDate: new Date(transactionDate),
      transactionType,
      tagIds: tagIds ? tagIds.split(',') : [],
    } satisfies EditTransactionDto,
    mode: 'all',
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
        name="currency"
        label="Currency"
        options={currenciesOptions}
        isSearchable
      />
      <FormSelectOptions
        control={control}
        name="transactionType"
        label="Transaction Type"
        options={transactionTypeOptions}
      />
      <FormSelectOptionsAsync
        control={control}
        name="walletId"
        label="Wallet"
        queryResult={trpc.getWalletsQuery.useQuery({
          organizationId: activeOrganization.id,
        })}
        mapDataToOptions={data => {
          return {
            label: data.name,
            value: data.id,
          };
        }}
      />
      <FormSelectOptionsAsync
        control={control}
        name="categoryId"
        label="Category"
        queryResult={trpc.getCategoriesQuery.useQuery({
          organizationId: activeOrganization.id,
        })}
        mapDataToOptions={data => {
          return {
            label: data.name,
            value: data.id,
          };
        }}
      />
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
        label="Save changes"
        onPress={onSubmit}
      />
    </View>
  );
}
