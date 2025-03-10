import { createContext, useContext } from 'react';

// Create an empty AuthContext for now
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// Temporary AuthProvider component (empty)
export function AuthProvider({ children }) {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
