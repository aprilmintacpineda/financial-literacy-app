import { zodResolver } from '@hookform/resolvers/zod';
import {
  type AddCategoryDto,
  addCategoryDto,
} from '@packages/data-transfer-objects/dtos';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import FormSubmitButton from '../../components/forms/submit-button';
import FormTextInput from '../../components/forms/text-input';
import { useAuthContext } from '../../contexts/auth';
import { alertMessage, alertUknownError } from '../../utils/alerts';
import { trpc } from '../../utils/trpc';

export default function AddCategory () {
  const { activeOrganization } = useAuthContext();
  const router = useRouter();

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(addCategoryDto),
    values: {
      name: '',
      description: '',
      organizationId: activeOrganization!.id,
    } satisfies AddCategoryDto,
    mode: 'all',
  });

  const { mutateAsync } = trpc.addCategoryMutation.useMutation();

  const onSubmit = handleSubmit(async data => {
    try {
      await mutateAsync(data);
      router.dismissAll();
      alertMessage('Category added successfully');
    } catch (error) {
      console.log(error);
      // @todo log to sentry?
      alertUknownError();
    }
  });

  return (
    <View className="p-5">
      <FormTextInput control={control} name="name" label="Name" />
      <FormTextInput
        control={control}
        name="description"
        label="Short description (optional)"
      />
      <FormSubmitButton
        control={control}
        label="Add Category"
        onPress={onSubmit}
      />
    </View>
  );
}
