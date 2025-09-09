import { zodResolver } from '@hookform/resolvers/zod';
import {
  editCategoryDto,
  type EditCategoryDto,
} from '@packages/data-transfer-objects/dtos';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import FormSubmitButton from '../../components/forms/submit-button';
import FormTextInput from '../../components/forms/text-input';
import { useAuthContext } from '../../contexts/auth';
import { alertMessage, alertUknownError } from '../../utils/alerts';
import { trpc } from '../../utils/trpc';

export default function EditCategory() {
  const { id, name, description } =
    useLocalSearchParams<EditCategoryDto>();
  const router = useRouter();
  const { activeOrganization } = useAuthContext(true);

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(editCategoryDto),
    values: {
      organizationId: activeOrganization.id,
      id,
      name,
      description,
    } satisfies EditCategoryDto,
    mode: 'all',
  });

  const { mutateAsync } = trpc.editCategoryMutation.useMutation();

  const onSubmit = handleSubmit(async data => {
    try {
      await mutateAsync(data);
      router.dismissAll();
      alertMessage('Category edited successfully');
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
        label="Save changes"
        onPress={onSubmit}
      />
    </View>
  );
}
