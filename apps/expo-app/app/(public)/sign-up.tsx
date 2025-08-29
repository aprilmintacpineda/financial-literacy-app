import { zodResolver } from '@hookform/resolvers/zod';
import { signUpDto } from '@packages/data-transfer-objects/dtos';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import FormSubmitButton from '../../components/forms/submit-button';
import FormTextInput from '../../components/forms/text-input';
import { alertMessage, alertUknownError } from '../../utils/alerts';
import { trpc, type tTRPCClientError } from '../../utils/trpc';

export default function HomeScreen () {
  const { mutateAsync } = trpc.signUpMutation.useMutation();

  const router = useRouter();

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(signUpDto),
    mode: 'all',
    values: {
      email: '',
      name: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async form => {
    try {
      await mutateAsync(form);
      router.navigate('/(public)');

      alertMessage(
        'Success 🚀',
        'You can now login using your account',
      );
    } catch (_error) {
      // @todo log in sentry?
      console.log(_error);

      const error = _error as tTRPCClientError;

      if (error.data?.code === 'CONFLICT')
        alertMessage('That email is already in use.');
      else alertUknownError();
    }
  });

  return (
    <View className="flex-1">
      <View className="p-5">
        <Text className="mb-10">
          Create your account now and start improving your personal
          finance! 🚀{' '}
          <Text className="font-bold">
            Get started for free, no credit card required
          </Text>
        </Text>
        <FormTextInput
          label="Email"
          control={control}
          name="email"
          placeholder="E.g., you@email.com"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />
        <FormTextInput
          label="Password"
          control={control}
          name="password"
          secureTextEntry
          placeholder="Your secret password"
          textContentType="newPassword"
        />
        <FormTextInput
          label="Name"
          control={control}
          name="name"
          placeholder="E.g., April"
          textContentType="name"
          autoCapitalize="words"
        />
        <FormSubmitButton
          control={control}
          onPress={onSubmit}
          label="Create Account"
        />
      </View>
    </View>
  );
}
