import { zodResolver } from '@hookform/resolvers/zod';
import { signInDto } from '@packages/data-transfer-objects/dtos';
import { Link } from 'expo-router';
import * as secureStore from 'expo-secure-store';
import { useForm } from 'react-hook-form';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormSubmitButton from '../../components/forms/submit-button';
import FormTextInput from '../../components/forms/text-input';
import { useAuthContext } from '../../contexts/auth';
import { alertUknownError } from '../../utils/alerts';
import { trpc, type tTRPCClientError } from '../../utils/trpc';

export default function HomeScreen () {
  const { mutateAsync } = trpc.signInMutation.useMutation();
  const { login } = useAuthContext();

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(signInDto),
    mode: 'all',
    values: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async formData => {
    try {
      const { token, publicUserData } = await mutateAsync(formData);
      await secureStore.setItemAsync('token', token);
      login(token, publicUserData, publicUserData.organizations[0]);
    } catch (_error) {
      console.log(_error);

      const error = _error as tTRPCClientError;

      if (error.data?.code === 'UNAUTHORIZED')
        Alert.alert('', 'Incorrect email/password.');
      else alertUknownError();
    }
  });

  return (
    <View className="flex-1 bg-primary">
      <SafeAreaView />
      <View className="h-[300] items-center justify-center">
        <Text className="text-center text-5xl font-bold text-primary-contrast-text">
          Entrepic
        </Text>
        <Text className="text-center text-2xl font-thin text-primary-contrast-text">
          Your personal finance buddy
        </Text>
      </View>
      <View className="mt-5 flex-1 bg-white p-5">
        <Text className="mb-2 text-3xl">Sign in</Text>
        <Text className="mb-10">
          Don't have an account yet? 🚀{' '}
          <Link href="/sign-up" className="text-primary underline">
            Sign up
          </Link>{' '}
          now and start improving your personal finance!
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
          textContentType="password"
        />
        <FormSubmitButton
          control={control}
          onPress={onSubmit}
          label="Sign in"
        />
      </View>
    </View>
  );
}
