import React, { useState, useContext } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, TextInput } from "react-native";
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from "../../contexts/AuthContext";

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../../routes/app.routes';

import { api } from "../../services/api";

export default function Dashboard(){
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
    const { signOut } = useContext(AuthContext);
    const [ mesa, setMesa ] = useState('');

   async function abrirMesa() {
        // alert(`Abrir mesa ${mesa}`);
        if(mesa === '') return;

        // Precisamos executar requisição de abrir mesa
        const response = await api.post('/neworder', { table: Number(mesa), name: ''});
        // console.log(response.data);

        // Como estamos no dashboard, vamos navegar para a tela de Pedidos
        navigation.navigate('Order', {
            mesa: response.data.table,
            order_id: response.data.id
        });
        // Limpamos o campo
        setMesa('');
   }


    return (
        <SafeAreaView style={estilos.container}>
            <Text style={estilos.title}>Novo Pedido</Text>
            <TextInput
                style={estilos.input}
                keyboardType="numeric"
                placeholder="Número da mesa"
                placeholderTextColor='#F0F0F0'
                value={mesa}
                onChangeText={setMesa}
            />
            <TouchableOpacity style={estilos.button} onPress={abrirMesa}>
                <Text style={estilos.buttonText}>Abrir Mesa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={estilos.button} onPress={signOut}>
                <Text style={estilos.buttonText}> Logout </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#1d1d2e'
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'yellow',
        marginBottom: 24
    },
    input: {
        width: '90%',
        height: 60,
        backgroundColor: '#101026',
        paddingHorizontal: 8,
        borderRadius: 4,
        textAlign: 'center',
        fontSize: 22,
        color: '#FFF'
    },
    button: {
        width: '90%',
        height: 40,
        backgroundColor: '#3FFFA3',
        borderRadius: 4,
        marginVertical: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        color: '#101026',
        fontWeight: 'bold'
    },
});