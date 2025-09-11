import { zodResolver } from '@hookform/resolvers/zod';
import {
  type AddWalletDto,
  addWalletDto,
} from '@packages/data-transfer-objects/dtos';
import { currenciesOptions } from '@packages/data-transfer-objects/enums';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import FormNumberInput from '../../components/forms/number-input';
import FormSelectOptions from '../../components/forms/select-options';
import FormSubmitButton from '../../components/forms/submit-button';
import FormTextInput from '../../components/forms/text-input';
import { useAuthContext } from '../../contexts/auth';
import { alertMessage, alertUknownError } from '../../utils/alerts';
import { trpc } from '../../utils/trpc';

const walletTypeOptions = [
  {
    label: 'Debit',
    value: 'Debit',
  },
  {
    label: 'Credit',
    value: 'Credit',
  },
];

export default function AddWallet () {
  const { activeOrganization } = useAuthContext(true);
  const router = useRouter();

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(addWalletDto),
    values: {
      name: '',
      amount: 0,
      organizationId: activeOrganization.id,
      currency: 'PHP',
      walletType: 'Debit',
    } satisfies AddWalletDto,
    mode: 'all',
  });

  const { mutateAsync } = trpc.addWalletMutation.useMutation();

  const onSubmit = handleSubmit(async data => {
    try {
      await mutateAsync(data);
      router.dismissAll();
      alertMessage('Wallet added successfully');
    } catch (error) {
      console.log(error);
      // @todo log to sentry?
      alertUknownError();
    }
  });

  return (
    <View className="p-5">
      <FormTextInput control={control} name="name" label="Name" />
      <FormNumberInput
        control={control}
        name="amount"
        label="Initial Amount"
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
        name="walletType"
        label="Type"
        options={walletTypeOptions}
      />
      <FormSubmitButton
        control={control}
        label="Add Wallet"
        onPress={onSubmit}
      />
    </View>
  );
}
