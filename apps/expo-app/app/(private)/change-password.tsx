import { zodResolver } from '@hookform/resolvers/zod';
import {
  type ChangePasswordDto,
  changePasswordDto,
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

export default function ChangePassword () {
  const { publicUserData, setUserData } = useAuthContext(true);
  const router = useRouter();

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(changePasswordDto),
    values: {
      code: '',
      newPassword: '',
      confirmNewPassword: '',
    } satisfies ChangePasswordDto,
    mode: 'all',
  });

  const {
    mutateAsync: submitChangePassword,
    isPending: isSubmitting,
  } = trpc.changePasswordMutation.useMutation();
  const {
    mutateAsync: sendChangePasswordVerificationCode,
    isPending: isSendingVerificationCode,
  } = trpc.changePasswordSendVerificationCodeMutation.useMutation();

  const onSubmit = handleSubmit(async data => {
    try {
      await submitChangePassword(data);
      router.dismissAll();
      alertMessage('Password changed successfully');
    } catch (_error) {
      console.log(_error);

      const error = _error as tTRPCClientError;

      if (error.data?.code === 'UNPROCESSABLE_CONTENT') {
        alertMessage(
          'Your verification code is invalid or has expired.',
        );
      } else if (error.data?.code === 'TOO_MANY_REQUESTS') {
        alertMessage('You have reached the maximum attempts.');
      } else if (error.data?.code === 'BAD_REQUEST') {
        alertMessage('Incorrect code');
      } else {
        // @todo log to sentry?
        alertUknownError();
      }
    }
  });

  const sendVerificationCode = async () => {
    try {
      await sendChangePasswordVerificationCode();

      setUserData(({ publicUserData, activeOrganization }) => {
        return {
          publicUserData: {
            ...publicUserData!,
            changePasswordVerificationCodeCanSentAt: new Date(
              Date.now() + 2 * 60 * 1000,
            ),
          },
          activeOrganization: activeOrganization!,
        };
      });
    } catch (error) {
      console.log(error);
      // @todo log to sentry?
      alertUknownError();
    }
  };

  return (
    <View className="p-5">
      <Text className="mb-2 text-lg">
        We will sent your verification code to your email. Please
        enter the verification code below.
      </Text>
      <FormTextInput
        control={control}
        name="code"
        label="Verification Code"
        isDisabled={isSendingVerificationCode}
      />
      <TimedButton
        label="Send Verification Code"
        variant="outline"
        toDate={
          publicUserData.changePasswordVerificationCodeCanSentAt
        }
        onPress={sendVerificationCode}
        isDisabled={isSendingVerificationCode || isSubmitting}
      />
      <View className="border-b-hairline my-6 border-b-disabled-border" />
      <FormTextInput
        control={control}
        name="newPassword"
        label="New Password"
        secureTextEntry
        textContentType="newPassword"
        autoCapitalize="none"
        autoComplete="password-new"
        isDisabled={isSendingVerificationCode}
      />
      <FormTextInput
        control={control}
        name="confirmNewPassword"
        label="Retype New Password"
        secureTextEntry
        textContentType="newPassword"
        autoCapitalize="none"
        autoComplete="password-new"
        isDisabled={isSendingVerificationCode}
      />
      <FormSubmitButton
        control={control}
        label="Submit"
        onPress={onSubmit}
        isDisabled={isSendingVerificationCode}
      />
    </View>
  );
}
