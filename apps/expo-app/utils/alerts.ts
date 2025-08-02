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
