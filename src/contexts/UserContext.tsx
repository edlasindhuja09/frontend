import { createContext, useState, useContext, ReactNode } from 'react';

// Define a User type
type User = {
  token: string;
  name: string;
} | null;

type UserContextType = {
  user: User;
  login: (token: string, name: string) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

// Context Provider to manage user state
export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User>(null);

  const login = (token: string, name: string) => {
    setUser({ token, name });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

