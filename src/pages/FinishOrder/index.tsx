import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../../routes/app.routes';

import { api } from '../../services/api';

type RouteDetailParams = {
    FinishOrder: {
        mesa: string | number;
        order_id: string;
    }
}

type FinishOrderRouteProp = RouteProp<RouteDetailParams, 'FinishOrder'>;

export default function FinishOrder(){
    const route = useRoute<FinishOrderRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    async function handleFinish(){
        // alert(`Finalizando mesa ${route.params?.mesa}`);
        try {
            // Executamos o processo de envio do pedido para a cozinha
            await api.put('/sendorder', {
                order_id: route.params?.order_id
            });
            // Vamos pro início (teoricamente o dashboard)
            alert('Pedido finalizado!');
            navigation.popToTop();

        } catch(err) {
            // Alguma coisa errada não está certa..
            alert(`Não foi possível fechar a mesa ${route.params?.mesa}`);
            console.error(err);
        }
        
    }

    return (
        <View style={estilos.container}>
            <Text style={estilos.alerta}>Quer mesmo fechar esse pedido?</Text>
            <Text style={estilos.mesa}>Mesa {route.params?.mesa}</Text>
            <TouchableOpacity style={estilos.botao} onPress={handleFinish}>
                <Text style={estilos.textoBotao}>Finalizar Pedido</Text>
                <Feather name='shopping-cart' size={20} color='#1d1d2e' />
            </TouchableOpacity>
        </View>
    )
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1d1d2e',
        paddingVertical: '5%',
        paddingHorizontal: '4%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    alerta: {
        fontSize: 20,
        color: '#FFF',
        fontWeight: 'bold',
        marginBottom: 12
    },
    mesa: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 12
    },
    botao: {
        backgroundColor: '#3fffa3',
        flexDirection: 'row',
        width: '65%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4
    },
    textoBotao: {
        fontSize: 18,
        marginRight: 8,
        fontWeight: 'bold',
        color: '#1d1d2e'
    }
});