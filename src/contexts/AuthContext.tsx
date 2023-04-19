import { useState, ReactNode, createContext, useEffect } from "react";

import { api } from "@services/api"
import { UserDTO } from "src/dtos/UserDTO";

import { storageUserRemove, storageUserSave, storageUserGet } from "@storage/storageUser";
import { storageAuthTokenSave, storageAuthTokenRemove, storageAuthTokenGet } from "@storage/storageAuthToken"
import { Alert } from "react-native";

export type AuthContextDataProps = {
    user: UserDTO;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>
    signOutMenu: () => Promise<void>
    isLoadingUserStorageData: boolean;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<UserDTO>({} as UserDTO)
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

    async function userAndTokenUpdate(userData: UserDTO, token: string) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
    }

    async function storageUserAndTokenSave(userData: UserDTO, token: string, refresh_token: string) {
        try {
            setIsLoadingUserStorageData(true);
            await storageUserSave(userData);
            await storageAuthTokenSave({ token, refresh_token });
        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function signIn(email: string, password: string) {
        try {
            const { data } = await api.post('/sessions', { email, password });

            if (data.user && data.token && data.refresh_token) {
                await storageUserAndTokenSave(data.user, data.token, data.refresh_token);
                userAndTokenUpdate(data.user, data.token);
            }
        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function signOut() {
        try {
            setIsLoadingUserStorageData(true);
            setUser({} as UserDTO);
            await storageUserRemove();
            await storageAuthTokenRemove();
        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function signOutMenu() {
        try {
            Alert.alert("Logout", "Deseja mesmo sair?", [
                {
                    text: 'Sim',
                    onPress: async () => {
                        setIsLoadingUserStorageData(true);
                        setUser({} as UserDTO);
                        await storageUserRemove();
                        await storageAuthTokenRemove();
                        setIsLoadingUserStorageData(false);
                    }
                },
                {
                    text: 'Não',
                }
            ])

        } catch (error) {
            throw error
        }
    }

    async function loadUserData() { // Checar se existe registro no Storage
        try {
            setIsLoadingUserStorageData(true);

            const userLogged = await storageUserGet();
            const { token } = await storageAuthTokenGet();

            if (token && userLogged) {
                userAndTokenUpdate(userLogged, token);
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    useEffect(() => {
        loadUserData();
    }, [])

    useEffect(() => {
        const subscrible = api.registerInterceptTokenManager(signOut);

        return () => {
            subscrible();
        }
    }, [signOut])
    return (
        <AuthContext.Provider value={{
            user,
            signIn,
            signOut,
            signOutMenu,
            isLoadingUserStorageData
        }}>
            {children}
        </AuthContext.Provider>
    )
}