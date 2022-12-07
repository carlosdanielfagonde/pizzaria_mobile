import React, { useState, useEffect } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    FlatList
} from 'react-native';

import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { api } from '../../services/api';
import { ModalPicker } from '../../components/ModalPicker';
import { ItemList } from '../../components/ItemList';

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParamList } from '../../routes/app.routes'

type RouteParameters = {
    Order: {
        mesa: string | number;
        order_id: string;
    }
};
type OrderRouteProps = RouteProp<RouteParameters, 'Order'>;

export type CategoryProps = {
    id: string;
    name: string;
}

export type ProductProps = {
    id: string;
    name: string;
}

type itemProps = {
    id: string;
    product_id: string;
    name: string;
    amount: string | number;
}

export default function Order(){
    const route = useRoute<OrderRouteProps>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    // Estados para tratamento de Categorias
    const [categorias,setCategorias] = useState<CategoryProps[] | []>([]);
    const [categoria,setCategoria] = useState<CategoryProps | undefined>();
    const [modalCategoryVisible,setModalCategoryVisible] = useState(false);

    // Estados para tratamento de Produtos
    const [produtos,setProdutos] = useState<ProductProps[] | []>([]);
    const [produto,setProduto] = useState<ProductProps | undefined>();
    const [modalProductVisible,setModalProductVisible] = useState(false);

    // 
    const [amount,setAmount] = useState('1');

    // Lista de itens de um pedido
    const[items,setItems] = useState<itemProps[]>([]);

    // Vamos atras da lista de categorias
    useEffect(() => {
        // Definimos o processo de recuperação das categorias
        async function getCategories(){
            // 
            const response = await api.get('/listcategories');
            // console.log(response.data);
            setCategorias(response.data);
            setCategoria(response.data[0]);
        }

        // Recuperamos as categorias
        getCategories()
            // .then(data => console.log('Categorias recuperadas') )
            .catch(err => { console.error('Não foi possível ler as categorias'); throw err; });
    }, []);

    // Vamos a por los produtos de uma determinada categoria
    useEffect(() => {
        // Pareceido com o anterior, definimos o processo que recupera os dados
        async function getProdutos(){
            // 
            const response = await api.get('/products/category', {
                params: {
                    category_id: categoria?.id
                }
            });
            //
            // console.log(response.data);
            setProdutos(response.data);   // Guardamos a lista de produtos recebida
            setProduto(response.data[0]);   // O primeiro produto ficará ativo
        }

        // Rodamos o processo..
        if(categoria){
            // Somente vamos atras dos produtos quando temos uma categoria
            getProdutos()
            // .then(data => console.log('Lista de produtos recuperada'))
            .catch(err => { console.error('Não foi possível recuperar a lista de produtos'); throw err; });
        } else {
            // Somente limpamos
            setProdutos([]);
        }
    }, [categoria]);   // Processo será executado sempre que mudar a categoria

    async function handleCloseOrder(){
        // alert(`Fechou a mesa ${route.params.mesa}`);
        try {
            const response = await api.delete('/deleteorder', {
                params: {
                    order_id: route.params?.order_id
                }
            });
            // Após o fechamento, voltamos para a página anterior
            navigation.goBack();
        } catch(err) {
            console.error(err);
        }
    }

    function handleChangeCategory(item: CategoryProps){
        setCategoria(item);
    }

    function handleChangeProduct(item: ProductProps){
        setProduto(item);
    }

    async function handleAddItem(){
        // console.log('Novo item na mesa');
        const response = await api.post('/newitem', {
            order_id: route.params?.order_id,
            product_id: produto?.id,
            amount: Number(amount)
        });

        // Montamso o objeto no formato correto
        let data = {
            id: response.data.id as string,
            product_id: produto?.id as string,
            name: produto?.name as string,
            amount: amount
        };

        // Incluimos o nodo item na lista
        setItems(oldItems => [...oldItems, data]);
    }

    async function handleDeleteItem(item_id: string){
        // alert(`Eliminando item ${item_id}`);

        // Excluimos o item do bando
        const response = await api.delete('/deleteitem', {
            params: {
                item_id
            }
        });

        // Para excluir da lista, vamos ficar como todos menos o dito cujo
        let meusItens = items.filter( item => item.id !== item_id );
        setItems(meusItens);
    }

    function handleFinishing(){
        // Vamos para a página de fechamento de pedidos
        navigation.navigate("FinishOrder", {
            mesa: route.params?.mesa,
            order_id: route.params?.order_id
        });
    }

    return (
        <View style={estilos.container}>
            <View style={estilos.header}>
                <Text style={estilos.titulo}>Mesa {route.params.mesa}</Text>
                {
                    items.length === 0 && (
                        <TouchableOpacity onPress={handleCloseOrder}>
                            <Feather
                                name="trash-2"
                                size={24}
                                color="#FF3F4B"
                            />
                        </TouchableOpacity>
                    )
                }
            </View>

            {
                categorias.length !== 0 && (
                    <TouchableOpacity style={estilos.input} onPress={ () => setModalCategoryVisible(true)}>
                        <Text style={{ color: '#FFF'}}>{categoria?.name}</Text>
                    </TouchableOpacity>
                )
            }

            {
                produtos.length !== 0 && (
                    <TouchableOpacity style={estilos.input} onPress={() => setModalProductVisible(true)}>
                        <Text style={{ color: '#FFF'}}>{produto?.name}</Text>
                    </TouchableOpacity>
                )
            }

            <View style={estilos.qtdContainer}>
                <Text style={estilos.qtdText}>Quantidade</Text>
                <TextInput
                    value={amount}
                    onChangeText={setAmount}
                    placeholderTextColor="#F0F0F0"
                    keyboardType="numeric"
                    style={[estilos.input, { width: '50%', textAlign: 'center' }]}
                />
            </View>

            <View style={estilos.actions}>
                <TouchableOpacity style={estilos.buttonAdd} onPress={handleAddItem}>
                    <Text style={estilos.buttonText}> + </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[estilos.button, { opacity: items.length === 0 ? 0.4 : 1 }]}
                    disabled={items.length === 0}
                    onPress={handleFinishing}>

                    <Text style={estilos.buttonText}> Avançar </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, marginTop: 24 }}
                data={items}
                keyExtractor={it => it.id}
                renderItem={ ({item}) => <ItemList data={item} deleteItem={handleDeleteItem} /> }
            />


            <Modal
                transparent={true}
                visible={modalCategoryVisible}
                animationType='slide'
            >
                <ModalPicker
                    handleCloseModal={() => setModalCategoryVisible(false)}
                    options={categorias}
                    selectedItem={ handleChangeCategory }
                />
            </Modal>

            <Modal
                transparent={true}
                visible={modalProductVisible}
                animationType='fade'
            >
                <ModalPicker
                    handleCloseModal={() => setModalProductVisible(false)}
                    options={produtos}
                    selectedItem={ handleChangeProduct }
                />
            </Modal>
        </View>
    )
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1d1d2e',
        paddingVertical: '5%',
        paddingEnd: '4%',
        paddingStart: '4%'
    },
    header: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
        marginTop: 24
    },
    titulo: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginRight: 14
    },
    input: {
        color: '#FFF',
        backgroundColor: '#101026',
        fontSize: 20,
        borderRadius: 4,
        width: '100%',
        height: 40,
        marginBottom: 12,
        justifyContent: 'center',
        paddingHorizontal: 8
    },
    qtdContainer: {
        flexDirection: 'row',
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    qtdText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF'
    },
    actions: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    buttonAdd: {
        backgroundColor: '#3fd1ff',
        borderRadius: 4,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        width: '25%'
    },
    buttonText: {
        color: '#101026',
        fontSize: 18,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%'
    },
});