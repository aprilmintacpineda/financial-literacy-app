import { zodResolver } from '@hookform/resolvers/zod';
import {
  verifyEmailDto,
  type VerifyEmailDto,
} from '@packages/data-transfer-objects/dtos';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import FormSubmitButton from '../../components/forms/submit-button';
import FormTextInput from '../../components/forms/text-input';
import TimedButton from '../../components/timed-button';
import { useAuthContext } from '../../contexts/auth';
import { alertMessage, alertUknownError } from '../../utils/alerts';
import { trpc, type tTRPCClientError } from '../../utils/trpc';

export default function VerifyEmail() {
  const router = useRouter();
  const { publicUserData, setUserData } = useAuthContext(true);
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(verifyEmailDto),
    values: {
      code: '',
    } satisfies VerifyEmailDto,
    mode: 'all',
  });

  const resendEmailVerification =
    trpc.resendEmailVerificationMutation.useMutation();
  const verifyEmail = trpc.verifyEmailMutation.useMutation();

  const onSubmit = handleSubmit(async data => {
    try {
      await verifyEmail.mutateAsync(data);
      router.navigate('/transactions');
    } catch (_error) {
      console.log(_error);

      const error = _error as tTRPCClientError;

      if (error.data?.code === 'BAD_REQUEST') {
        alertMessage('Incorrect code');
      } else if (error.data?.code === 'UNPROCESSABLE_CONTENT') {
        alertMessage('Your verification code has expired.');
      } else if (error.data?.code === 'TOO_MANY_REQUESTS') {
        alertMessage('You have reached the maximum attempts.');
      } else if (error.data?.code === 'CONFLICT') {
        alertMessage(
          'Your email is already verified. Please try to close and reopen the app.'
        );
      } else {
        // @todo log to sentry?
        alertUknownError();
      }
    }
  });

  const resendNewCode = async () => {
    try {
      await resendEmailVerification.mutateAsync();

      setUserData(({ publicUserData, activeOrganization }) => {
        return {
          publicUserData: {
            ...publicUserData!,
            emailVerificationCodeCanSentAt: new Date(
              Date.now() + 2 * 60 * 1000
            ),
          },
          activeOrganization: activeOrganization!,
        };
      });

      reset({ code: '' });
    } catch (error) {
      console.log(error);
      // @todo log to sentry?
      alertUknownError();
    }
  };

  return (
    <View className="p-5">
      <Text className="mb-2 text-lg">
        We have sent your verification code to your email. Please
        enter the verification code below.
      </Text>
      <FormTextInput
        control={control}
        name="code"
        label="Verification Code"
        textContentType="oneTimeCode"
        autoCapitalize="none"
        autoComplete="one-time-code"
        isDisabled={resendEmailVerification.isPending}
      />
      <FormSubmitButton
        control={control}
        label="Submit"
        onPress={onSubmit}
        isDisabled={resendEmailVerification.isPending}
      />
      <TimedButton
        label="Send a new code"
        toDate={publicUserData.emailVerificationCodeCanSentAt}
        variant="outline"
        className="mt-2"
        onPress={resendNewCode}
        isDisabled={
          resendEmailVerification.isPending || verifyEmail.isPending
        }
      />
    </View>
  );
}
