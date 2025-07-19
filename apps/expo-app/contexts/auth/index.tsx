import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface iState {
  token?: string;
  status: 'initial' | 'done';
}

type tAuthContext = iState & {
  setToken: (token: string) => void;
  restoredAuth: (clearToken?: boolean) => void;
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

  const restoredAuth = useCallback((clearToken?: boolean) => {
    setState(oldState => {
      return {
        ...oldState,
        status: 'done',
        token: clearToken ? undefined : oldState.token,
      };
    });
  }, []);

  const value = useMemo(() => {
    return {
      ...state,
      setToken,
      restoredAuth,
    };
  }, [state, restoredAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext () {
  return useContext(AuthContext);
}
