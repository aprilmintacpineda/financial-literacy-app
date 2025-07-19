import { Stack } from 'expo-router';
import * as secureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { useAuthContext } from '../contexts/auth';
import { trpc } from '../utils/trpc';

export default function Routes () {
  const { mutateAsync } = trpc.validateTokenMutation.useMutation();
  const { status, token, restoredAuth, setToken } = useAuthContext();

  useEffect(() => {
    if (status !== 'initial') return;

    async function validateToken () {
      try {
        await mutateAsync();
        restoredAuth();
      } catch (_error) {
        // @todo maybe log in sentry?
        console.log(_error);
        restoredAuth(true);
      }
    }

    async function restoreToken () {
      const token = await secureStore.getItemAsync('token');
      if (token) setToken(token);
      else restoredAuth(true);
    }

    if (token) validateToken();
    else restoreToken();
  }, [status, token]);

  if (status !== 'done') return null;

  const isLoggedIn = Boolean(token);

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen
          name="(private)"
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: 'fade_from_bottom',
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen
          name="(public)"
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: 'fade_from_bottom',
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
