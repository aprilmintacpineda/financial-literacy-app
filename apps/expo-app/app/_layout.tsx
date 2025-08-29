import '@js-joda/timezone';
import 'react-native-reanimated';
import '../global.css';

import Main from '../components/main';
import { AuthContextProvider } from '../contexts/auth';

export default function RootLayout () {
  return (
    <AuthContextProvider>
      <Main />
    </AuthContextProvider>
  );
}
