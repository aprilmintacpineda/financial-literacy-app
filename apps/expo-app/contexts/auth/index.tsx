import { type PublicUserData } from '@apps/trpc-server';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface iState {
  status: 'initial' | 'done';
  token?: string;
  publicUserData?: PublicUserData;
}

type tAuthContext = iState & {
  setToken: (token: string) => void;
  setUserData: (publicUserData: PublicUserData) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<tAuthContext>({} as tAuthContext);

export function AuthContextProvider ({
  children,
}: PropsWithChildren) {
  const [state, setState] = useState<iState>({
    status: 'initial',
  });

  const setToken = useCallback((token: string) => {
    setState(oldState => {
      return {
        ...oldState,
        token,
      };
    });
  }, []);

  const setUserData = useCallback(
    (publicUserData: PublicUserData) => {
      setState(oldState => {
        return {
          ...oldState,
          status: 'done',
          publicUserData,
        };
      });
    },
    [],
  );

  const clearAuth = useCallback(() => {
    setState(oldState => {
      return {
        ...oldState,
        status: 'done',
        publicUserData: undefined,
        token: undefined,
      };
    });
  }, []);

  const value = useMemo(() => {
    return {
      ...state,
      setToken,
      setUserData,
      clearAuth,
    };
  }, [state, setUserData]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext () {
  return useContext(AuthContext);
}
