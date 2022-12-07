import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";

import AuthRoutes from "./auth.routes";
import AppRoutes from "./app.routes";

import { AuthContext } from '../contexts/AuthContext';

function Routes(){
    const { isAuthenticated, loading } = useContext(AuthContext);

    // Precisamos saber se está carregando ou não
    if(loading){
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#1d1d2e',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator size={60} color='#FFF' />
            </View>
        )
    }

    return (
        isAuthenticated ? <AppRoutes /> : <AuthRoutes />
    )
}

export default Routes;