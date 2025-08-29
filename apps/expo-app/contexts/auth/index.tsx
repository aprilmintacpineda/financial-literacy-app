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
  isLoggedIn: boolean;
}

type tAuthContext = iState & {
  setToken: (token: string) => void;
  setUserData: (
    resolver: (state: iState) => {
      publicUserData: PublicUserData;
      activeOrganization: PublicUserData['organizations'][number];
    }
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
    isLoggedIn: false,
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
          isLoggedIn: true,
        };
      });
    },
    [],
  );

  const setUserData = useCallback(
    (
      resolver: (state: iState) => {
        publicUserData: PublicUserData;
        activeOrganization: PublicUserData['organizations'][number];
      },
    ) => {
      setState(oldState => {
        const { publicUserData, activeOrganization } =
          resolver(oldState);

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
        isLoggedIn: false,
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

export function useAuthContext(): tAuthContext;
export function useAuthContext(
  requireLoggedIn: true
): Required<tAuthContext>;

export function useAuthContext (requireLoggedIn = false) {
  const context = useContext(AuthContext);

  if (
    requireLoggedIn &&
    (!context.publicUserData ||
      !context.activeOrganization ||
      !context.token)
  )
    throw new Error('User is not logged in');

  return context;
}
