import React, { useState, createContext, ReactNode, useEffect } from "react";
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserProps = {
    id: string;
    name: string;
    email: string;
    token: string;
}

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credenciais: SignInProps) => Promise<void>;
    loadingAuth: boolean;
    loading: boolean;
    signOut: () => Promise<void>;
}

type AuthProviderProps = {
    children: ReactNode;
}

type SignInProps = {
    email: string;
    password: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({children}: AuthProviderProps){
    const [user,setUser] = useState<UserProps>({
        id: '',
        name: '',
        email: '',
        token: ''
    });
    const [loadingAuth,setLoadingAuth] = useState(false);
    const [loading,setLoading] = useState(true);

    const isAuthenticated = !!user.id;   // True quando temos um usuário

    useEffect( () => {
        //
        async function getUser(){
            // Buscamos dados salvos do user
            const userInfo = await AsyncStorage.getItem('@pizzariaDigital');
            let hasUser: UserProps = JSON.parse(userInfo || '{}');

            // Vejamos se recebemos info de um usuário
            if(Object.keys(hasUser).length > 0){
                // Disponibilizamos os dados desse usuário encontrado para serem usados mais adiante
                api.defaults.headers.common['authorization'] = `Bearer ${hasUser.token}`;
                setUser({
                    id: hasUser.id,
                    name: hasUser.name,
                    email: hasUser.email,
                    token: hasUser.token
                });
            }
            setLoading(false);
        }

        getUser();
    }, []);

    async function signIn({ email, password}: SignInProps){
        // alert(`Login [${email}/${password}]`);
        setLoadingAuth(true);
        try {
            const response = await api.post('/authuser', { email, password });
            // console.log(response.data);
            const { id, name, token } = response.data;

            // Vamos salvar local para poder reaproveitar
            const data = { ...response.data }
            await AsyncStorage.setItem('@pizzariaDigital', JSON.stringify(data));

            // Vamos guardar o token na api, para futuras requisições
            api.defaults.headers.common['authorization'] = `Bearer ${token}`;

            setUser({ id, name, email, token });
            setLoadingAuth(false);

        } catch(err){
            // Problemas no login
            console.error('Erro efetuando login', err);
            setLoadingAuth(false);
        }
    }

    async function signOut(){
        await AsyncStorage.clear()
            .then( () => {
                setUser({
                    id: '',
                    name: '',
                    email: '',
                    token: ''
                });
            })
    }


    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, loadingAuth, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}