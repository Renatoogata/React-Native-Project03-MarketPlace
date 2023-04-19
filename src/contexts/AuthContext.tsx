import { useState, ReactNode, createContext, useEffect } from "react";


import { api } from "@services/api"
import { UserDTO } from "src/dtos/UserDTO";

export type AuthContextDataProps = {
    user: UserDTO;
    signIn: (email: string, password: string) => void
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<UserDTO>({
        id: '1',
        avatar: '233232',
        email: '321321',
        name: '321321321',
        phone: '31231321',
    } as UserDTO)

    async function signIn(email: string, password: string) {
        try {
            const { data } = await api.post('/sessions', { email, password });

            console.log(data);
        } catch (error) {

        }
    }


    useEffect(() => {

    }, [])
    return (
        <AuthContext.Provider value={{
            user,
            signIn,
        }}>
            {children}
        </AuthContext.Provider>
    )
}