import { Alert } from 'react-native';

export function alertUknownError () {
  Alert.alert(
    'Unknown Error',
    'An unknown error occured. Please try again later.',
  );
}

export function alertMessage (
  titleOrMessage: string,
  message?: string,
) {
  Alert.alert(
    message ? titleOrMessage : '',
    message ?? titleOrMessage,
  );
}

export function alertDialog ({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title?: string;
  message: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}) {
  Alert.alert(title ?? '', message, [
    {
      isPreferred: true,
      style: 'cancel',
      text: 'Abort',
      onPress: onCancel,
    },
    {
      style: 'destructive',
      text: 'Confirm',
      onPress: onConfirm,
    },
  ]);
}
