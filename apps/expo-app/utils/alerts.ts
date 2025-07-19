import { Alert } from 'react-native';

export function alertUknownError () {
  Alert.alert(
    'Unknown Error',
    'An unknown error occured. Please try again later.',
  );
}
