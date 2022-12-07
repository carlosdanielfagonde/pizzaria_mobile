import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";

import { CategoryProps } from '../../pages/Order';

interface ModalPickerProps {
    options: CategoryProps[];
    handleCloseModal: () => void;
    selectedItem: (item: CategoryProps) => void;
}

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

export function ModalPicker({ options, handleCloseModal, selectedItem}: ModalPickerProps){
    // Função para selecionar a categoria clicada
    function onPressItem(item: CategoryProps){
        // Marcamos o item como selecionado
        // console.log(item);
        selectedItem(item);
        handleCloseModal();
    }

    // Preparamos as opções para serem mostradas
    const listaDeCategorias = options.map((item,index) => (
        <TouchableOpacity key={index} style={estilos.option} onPress={() => onPressItem(item)}>
            <Text style={estilos.item}>
                {item?.name}
            </Text>
        </TouchableOpacity>
    ));
    //
    return (
        <TouchableOpacity style={estilos.container} onPress={handleCloseModal} >
            <View style={estilos.content}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {listaDeCategorias}
                </ScrollView>
            </View>
        </TouchableOpacity>
    )
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        width: WIDTH - 20,
        height: HEIGHT / 2,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#8a8a8a',
        borderRadius: 4
    },
    option: {
        alignItems: 'flex-start',
        borderTopWidth: 0.8,
        borderTopColor: '#8a8a8a',
    },
    item: {
        margin: 20,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#101026'
    }
});