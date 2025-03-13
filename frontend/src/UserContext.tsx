import React, { createContext, useContext, useState, useEffect } from "react";

// Define user context type
interface UserContextType {
  userId: number | null;
  setUserId: (id: number) => void;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<number | null>(null);

  console.log("enter", userId);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(Number(storedUserId));
    }
  }, []);

  return <UserContext.Provider value={{ userId, setUserId }}>{children}</UserContext.Provider>;
};
