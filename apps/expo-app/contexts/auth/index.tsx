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
  activeOrganization?: PublicUserData['organizations'][number];
}

type tAuthContext = iState & {
  setToken: (token: string) => void;
  setUserData: (
    publicUserData: PublicUserData,
    activeOrganization: PublicUserData['organizations'][number]
  ) => void;
  clearAuth: () => void;
  login: (
    token: string,
    publicUserData: PublicUserData,
    activeOrganization: PublicUserData['organizations'][number]
  ) => void;
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

  const login = useCallback(
    (
      token: string,
      publicUserData: PublicUserData,
      activeOrganization: PublicUserData['organizations'][number],
    ) => {
      setState(oldState => {
        return {
          ...oldState,
          token,
          publicUserData,
          activeOrganization,
          status: 'done',
        };
      });
    },
    [],
  );

  const setUserData = useCallback(
    (
      publicUserData: PublicUserData,
      activeOrganization: PublicUserData['organizations'][number],
    ) => {
      setState(oldState => {
        return {
          ...oldState,
          status: 'done',
          publicUserData,
          activeOrganization,
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
      login,
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
