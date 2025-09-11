import 'react-native-reanimated';
import '../global.css';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import SuperJSON from 'superjson';
import Theme from '../components/theme';
import { useAuthContext } from '../contexts/auth';
import { trpc } from '../utils/trpc';
import Routes from './routes';

SplashScreen.preventAutoHideAsync();

export default function Main () {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
          mutations: {
            retry: false,
          },
        },
      }),
    [],
  );

  const { token, status } = useAuthContext();

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (status === 'done' && (loaded || error))
      SplashScreen.hideAsync();
  }, [loaded, error, status]);

  const trpcClient = useMemo(() => {
    return trpc.createClient({
      links: [
        httpBatchLink({
          transformer: SuperJSON,
          url: 'http://192.168.31.95:3000/trpc',
          headers: () => {
            const headers = new Headers();

            if (token)
              headers.set('Authorization', `Bearer ${token}`);

            return headers;
          },
        }),
      ],
    });
  }, [token]);

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <Theme>
          <StatusBar style="auto" translucent />
          <Routes />
        </Theme>
      </trpc.Provider>
    </QueryClientProvider>
  );
}
