import {createContext, useState} from 'react'
import type {ReactNode,Dispatch,SetStateAction} from 'react'
import {getMe} from './services/auth.api'


interface AuthContextType {
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

interface AuthProviderProps{
    children: ReactNode
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user,setUser] = useState(null)
    const [loading,setLoading] = useState(true)

    return(
        <AuthContext value={{user,setUser,loading,setLoading}} >
        {children}
        </AuthContext>
    )
}