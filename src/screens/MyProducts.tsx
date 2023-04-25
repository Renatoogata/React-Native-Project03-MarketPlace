import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Box, FlatList, HStack, Icon, Select, Text, useToast, VStack } from "native-base";
import { AntDesign } from '@expo/vector-icons';

import { useNavigation } from "@react-navigation/native";
import { AppNavigatorStackRoutesProps } from "@routes/appStack.routes";

import { api } from "@services/api";

import ProductImage from '@assets/ImagemPadraoCompra.png'

import { ProductCard } from "@components/ProductCard";
import { Loading } from "@components/Loading";

import { ProductDTO } from "src/dtos/ProductDTO";

import { AppError } from "@utils/AppError";

export function MyProducts() {
    const [loading, setIsLoading] = useState(false);
    const [isActive, setIsActive] = useState("all");
    const [myProducts, setMyProducts] = useState<ProductDTO[]>([])

    const navigation = useNavigation<AppNavigatorStackRoutesProps>();
    const toast = useToast();

    const filter = isActive === "active" ? true : false;

    const productsFiltered = myProducts.filter((product) => {
        if (isActive === "all") {
            return true
        }
        return product.is_active === filter
    })

    function handleCreateProduct() {
        navigation.navigate('createProduct')
    }

    async function fetchMyProducts() {
        try {
            setIsLoading(true);
            const response = await api.get('/users/products');
            setMyProducts(response.data)
        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : "Não foi possível carregar meus produtos. Tente novamente mais tarde"
            toast.show({
                title,
                placement: 'top',
                bg: 'red.light'
            })
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMyProducts();
    }, [])

    return (
        <VStack
            pt={16}
            px={6}
            flex={1}
            bg='gray.6'
        >
            <HStack
                alignItems='center'
                justifyContent='center'
            >
                <Text
                    fontFamily='heading'
                    fontSize='lg'
                >
                    Meus anúncios
                </Text>

                <TouchableOpacity
                    style={{ position: 'absolute', right: 1 }}
                    onPress={handleCreateProduct}
                >
                    <Icon
                        as={AntDesign}
                        name="plus"
                        size={7}
                        color='gray.1'
                    />
                </TouchableOpacity>
            </HStack>

            <HStack
                mt={8}
                alignItems='center'
                justifyContent='space-between'
            >
                <Text
                    color='gray.2'
                >
                    {productsFiltered.length} {productsFiltered.length > 1 ? "anúncios" : "anúncio"}
                </Text>

                <Box
                    maxW={111}
                >
                    <Select
                        selectedValue={isActive}
                        width={111}
                        height={34}
                        accessibilityLabel="tipo de condicionamento"
                        placeholder="Todos"
                        _selectedItem={{
                            bg: "gray.",
                            rounded: 'md',
                        }}
                        onValueChange={item => setIsActive(item)}
                    >
                        <Select.Item label="Ativado" value="active" />
                        <Select.Item label="Inativo" value="inactive" />
                        <Select.Item label="Todos" value="all" />
                    </Select>
                </Box>
            </HStack>

            <VStack
                mt={6}
            >
                {
                    loading ? <Loading /> :
                        <FlatList
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            showsVerticalScrollIndicator={false}
                            data={productsFiltered}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <ProductCard
                                    source={
                                        item.product_images
                                            ? { uri: `${api.defaults.baseURL}/images/${item.product_images[0].path}` }
                                            : ProductImage
                                    }
                                    isNew={item.is_new}
                                    name={item.name}
                                    price={item.price}
                                    isActive={item.is_active}
                                />
                            )}
                            ListEmptyComponent={
                                <Text
                                    alignSelf='center'
                                    fontFamily='heading'
                                    mt={20}
                                >
                                    Você não tem nenhum produto cadastrado.
                                </Text>
                            }
                        />
                }
            </VStack>
        </VStack>
    )
}