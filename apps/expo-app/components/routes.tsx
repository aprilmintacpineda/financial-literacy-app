import { Stack } from 'expo-router';
import * as secureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { useAuthContext } from '../contexts/auth';
import { trpc } from '../utils/trpc';

export default function Routes () {
  const { mutateAsync } = trpc.validateTokenMutation.useMutation();
  const { status, token, clearAuth, login, setToken, isLoggedIn } =
    useAuthContext();

  useEffect(() => {
    if (status !== 'initial') return;

    async function validateToken () {
      try {
        const { publicUserData, token } = await mutateAsync();
        await secureStore.setItemAsync('token', token);

        login(
          token,
          publicUserData,
          publicUserData.organizations[0],
        );
      } catch (_error) {
        // @todo maybe log in sentry?
        console.log(_error);

        await secureStore.deleteItemAsync('token');
        clearAuth();
      }
    }

    async function restoreToken () {
      const token = await secureStore.getItemAsync('token');
      if (token) setToken(token);
      else clearAuth();
    }

    if (token) validateToken();
    else restoreToken();
  }, [status, token]);

  if (status !== 'done') return null;

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
      <Stack.Screen
        name="(public)"
        options={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'fade_from_bottom',
        }}
      />
    </Stack>
  );
}
