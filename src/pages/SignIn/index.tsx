import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

import { AuthContext } from '../../contexts/AuthContext';


export default function SignIn(){
    // Contextos
    const { signIn, loadingAuth } = useContext(AuthContext);

    // States
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    async function handleLogin(){
        // Não queremos mail ou senha vazios
        if(email === '' || password === '') return false;

        //
        // alert(`Efetuando login [${email}/${password}]`);
        signIn({ email, password })
            .then(data => console.log('Login Ok') )
            .catch(err => { console.error('Erro efetuando login'); throw err; });
    }

    return (
        <View style={estilos.container}>
            <Image
                style={estilos.logo}
                source={require('../../assets/logo.png')}
            />
            <View style={estilos.inputContainer}>
                <TextInput
                    placeholder='Digite seu email'
                    placeholderTextColor='#F0F0F0'
                    style={estilos.input}
                    value={email}
                    // onChangeText={ text => setEmail(text) }
                    onChangeText={ setEmail }
                />
                <TextInput
                    placeholder='Digite sua senha'
                    placeholderTextColor='#F0F0F0'
                    secureTextEntry={true}
                    style={estilos.input}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={estilos.button} onPress={handleLogin}>
                    { 
                        loadingAuth
                        ?
                        (
                            <ActivityIndicator size={25} color='#FFF' />
                        )
                        :
                        (
                            <Text style={estilos.buttonText}>Acessar</Text>
                        )
                    }
                </TouchableOpacity>
            </View>
        </View>
    )
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1d1d2e'
    },
    logo: {
        marginBottom: 18,
    },
    inputContainer: {
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
        paddingHorizontal: 14
    },
    input: {
        width: '95%',
        height: 40,
        backgroundColor: '#101026',
        marginBottom: 12,
        borderRadius: 4,
        paddingHorizontal: 8,
        color: '#FFF'
    },
    button: {
        width: '95%',
        height: 40,
        backgroundColor: '#3FFFA3',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#101026'
    }
});