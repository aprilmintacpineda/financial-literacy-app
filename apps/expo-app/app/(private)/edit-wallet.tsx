import { zodResolver } from '@hookform/resolvers/zod';
import {
  editWalletDto,
  type EditWalletDto,
} from '@packages/data-transfer-objects/dtos';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import FormSubmitButton from '../../components/forms/submit-button';
import FormTextInput from '../../components/forms/text-input';
import { useAuthContext } from '../../contexts/auth';
import { alertMessage, alertUknownError } from '../../utils/alerts';
import { trpc } from '../../utils/trpc';

export default function EditWallet() {
  const { id, name } = useLocalSearchParams<EditWalletDto>();
  const router = useRouter();
  const { activeOrganization } = useAuthContext(true);

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(editWalletDto),
    values: {
      id,
      name,
      organizationId: activeOrganization.id,
    } satisfies EditWalletDto,
    mode: 'all',
  });

  const { mutateAsync } = trpc.editWalletMutation.useMutation();

  const onSubmit = handleSubmit(async data => {
    try {
      await mutateAsync(data);
      router.dismissAll();
      alertMessage('Wallet edited successfully');
    } catch (error) {
      console.log(error);
      // @todo log to sentry?
      alertUknownError();
    }
  });

  return (
    <View className="p-5">
      <FormTextInput control={control} name="name" label="Name" />
      <FormSubmitButton
        control={control}
        label="Save changes"
        onPress={onSubmit}
      />
    </View>
  );
}
