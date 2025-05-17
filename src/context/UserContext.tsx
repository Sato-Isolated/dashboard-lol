import React, { createContext, useContext, useState } from 'react'

// Interface user defines the structure of the user object
// It contains the following properties:
// - summonerName: string - The name of the summoner
// - tagline: string - The tagline of the summoner
// - region: string - The region of the summoner
interface User {
  summonerName: string
  tagline: string
  region: string
}
// The UserContextType interface defines the structure of the context
// It contains the following properties:
// - user: User - The user object
// - setUser: React.Dispatch<React.SetStateAction<User>> - A function to update the user object
// The setUser function is used to update the user object in the context
interface UserContextType {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
}
// The UserContext is created using React's createContext function
const UserContext = createContext<UserContextType | undefined>(undefined)

// The UserProvider component is a context provider that wraps its children with the UserContext
// It provides the user object and the setUser function to its children
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    summonerName: '',
    tagline: '',
    region: 'euw1',
  })

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

// The useUser hook is a custom hook that allows components to access the UserContext
// It throws an error if the hook is used outside of the UserProvider
export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
