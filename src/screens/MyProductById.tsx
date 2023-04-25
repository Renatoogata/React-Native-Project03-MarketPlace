import { useCallback, useState } from "react";
import { Alert, Dimensions, TouchableOpacity, View } from "react-native";
import { HStack, ScrollView, Text, VStack, Image, Icon, Box, useToast } from "native-base";

import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorStackRoutesProps } from "@routes/appStack.routes";
import { api } from "@services/api";

import Carousel from "react-native-reanimated-carousel";
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Avatar from '@assets/avatar.png'

import { ProductDTO } from "src/dtos/ProductDTO";
import { PaymentMethodDTO } from "src/dtos/PaymentMethodDTO";

import { UserPhoto } from "@components/UserPhoto";
import { Button } from "@components/Button";

import { AppError } from "@utils/AppError";



type RouteParamsProps = {
    productId: string
}

export function MyProductById() {
    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState<ProductDTO>({} as ProductDTO)
    const [numberOfImages, setNumberOfImages] = useState(0);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDTO[]>([]);
    const [isActive, setIsActive] = useState<boolean>();

    const route = useRoute()
    const { productId } = route.params as RouteParamsProps;
    const navigation = useNavigation<AppNavigatorStackRoutesProps>()
    const toast = useToast()

    const width = Dimensions.get('window').width;

    function handleGoBack() {
        navigation.navigate('bottonTabRoutes');
    }

    function handleEditProduct() {
        navigation.navigate('editProduct', { productId })
    }

    async function handleInactiveOrActiveProduct() {
        Alert.alert(isActive ? "Desativar" : "Reativar", `Deseja ${isActive ? "Desativar" : "Ativar "} o anúncio?`, [
            {
                text: 'Sim',
                onPress: async () => {
                    try {
                        setIsLoading(true);
                        if (isActive) {
                            await api.patch(`/products/${productId}`, { is_active: false });
                            fetchProduct();
                            return
                        }

                        if (!isActive) {
                            await api.patch(`/products/${productId}`, { is_active: true });
                            fetchProduct();
                            return
                        }
                    } catch (error) {
                        const isAppError = error instanceof AppError
                        const title = isAppError ? error.message : "Não foi possível Ativar/Desativar anúncio"
                        toast.show({
                            title,
                            placement: 'top',
                            bg: 'red.light',
                        })
                    } finally {
                        setIsLoading(false)
                    }
                }
            },
            {
                text: 'Não',
                style: 'cancel'
            }
        ])
    }

    function handleRemoveProduct() {
        Alert.alert("Remover", "Deseja Remover o Anúncio?", [
            {
                text: 'Sim',
                onPress: async () => {
                    try {
                        setIsLoading(true);
                        await api.delete(`/products/${productId}`);

                        toast.show({
                            title: 'Item Removido com sucesso',
                            placement: 'top',
                            bg: 'blue.light',
                        })

                        navigation.goBack();
                    } catch (error) {
                        const isAppError = error instanceof AppError
                        const title = isAppError ? error.message : "Não foi possível Remover o anúncio"
                        toast.show({
                            title,
                            placement: 'top',
                            bg: 'red.light',
                        })
                    } finally {
                        setIsLoading(false)
                    }
                }
            },
            {
                text: 'Não',
                style: 'cancel'
            }
        ])
    }

    async function fetchProduct() {
        try {
            setIsLoading(true)
            const response = await api.get(`/products/${productId}`)
            setProduct(response.data);
            setNumberOfImages(response.data.product_images.length);
            setPaymentMethods(response.data.payment_methods)
            setIsActive(response.data.is_active)
        } catch (error) {
            throw (error)
        } finally {
            setIsLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fetchProduct();
    }, [productId]))

    return (
        <ScrollView
            flex={1}
            bg='gray.6'
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ paddingBottom: 30 }}
        >
            <HStack
                alignItems='center'
                justifyContent='space-between'
                paddingTop={16}
                px={6}
                mb={4}
            >
                <TouchableOpacity
                    onPress={handleGoBack}
                >
                    <Icon
                        as={MaterialCommunityIcons}
                        name="arrow-left"
                        size={6}
                        color='gray.1'
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleEditProduct}
                >
                    <Icon
                        as={MaterialCommunityIcons}
                        name="lead-pencil"
                        size={6}
                        color='gray.1'
                    />
                </TouchableOpacity>
            </HStack>

            <View>
                {
                    isActive ? null :
                        <Box
                            position='absolute'
                            bg='gray.1'
                            h={260}
                            w='full'
                            zIndex={1}
                            opacity={0.85}
                            alignItems='center'
                            justifyContent='center'
                        >
                            <Text
                                color='gray.7'
                                fontFamily='heading'
                            >
                                Anúncio Desativado
                            </Text>
                        </Box>
                }

                <Carousel
                    loop
                    width={width}
                    height={260}
                    autoPlay={numberOfImages > 1}
                    data={product.product_images}
                    scrollAnimationDuration={2000}
                    renderItem={({ item }) => (
                        <Image
                            source={{ uri: `${api.defaults.baseURL}/images/${item.path}` }}
                            w='full'
                            h='full'
                            alt="Foto Carrosel"
                            resizeMode='cover'
                        />
                    )}
                />
            </View>

            <VStack
                px={6}
            >
                <HStack
                    mt={5}
                    alignItems='center'
                >
                    <UserPhoto
                        source={
                            product.user?.avatar
                                ? { uri: `${api.defaults.baseURL}/images/${product.user?.avatar}` }
                                : Avatar
                        }
                        alt="foto de perfil"
                        size={7}
                        border={2}
                    />

                    <Text
                        ml={2}
                        color='gray.1'
                        fontSize='md'
                        numberOfLines={1}
                        flexShrink={1}
                    >
                        {product.user?.name}
                    </Text>
                </HStack>

                <Text
                    mt={6}
                    bg='gray.5'
                    w={14}
                    rounded="2xl"
                    textAlign='center'
                    fontSize='xs'
                    fontFamily='heading'
                >
                    {product.is_new ? "NOVO" : "USADO"}
                </Text>

                <HStack
                    mt={2}
                    alignItems='center'
                    justifyContent='space-between'
                >
                    <Text
                        fontSize='lg'
                        fontFamily='heading'
                        numberOfLines={1}
                        flexShrink={1}
                    >
                        {product.name}
                    </Text>
                    <Text
                        fontFamily='heading'
                        color='blue.light'
                        numberOfLines={1}
                        flexShrink={1}
                    >
                        R$ {' '}
                        <Text
                            fontSize='lg'
                        >
                            {product.price}
                        </Text>
                    </Text>
                </HStack>

                <Text
                    mt={2}
                    fontSize='sm'
                    color='gray.2'
                    numberOfLines={5}
                    flexShrink={1}
                >
                    {product.description}
                </Text>

                <HStack
                    mt={6}
                >
                    <Text
                        color='gray.2'
                        fontFamily="heading"
                    >
                        Aceita troca?
                    </Text>
                    <Text
                        ml={2}
                        color='gray.2'
                    >
                        {product.accept_trade ? "Sim" : "Não"}
                    </Text>
                </HStack>
                <Text
                    mt={3}
                    mb={2}
                    fontFamily='heading'
                    color='gray.2'
                >
                    Meios de pagamento:
                </Text>

                {
                    paymentMethods.map(item => (
                        <HStack alignItems='center' key={item.key}>
                            <Icon
                                as={MaterialCommunityIcons}
                                name={item.key === 'boleto' ? "barcode-scan" : item.key === 'deposit' ? "bank-outline" : item.key === 'pix' ? "qrcode-plus" : item.key === "cash" ? "cash" : "credit-card-outline"}
                                size={4}
                                mr={2}
                            />

                            <Text
                                color='gray.2'
                                numberOfLines={1}
                                flexShrink={1}
                            >
                                {item.key === 'boleto' ? "boleto" : item.key === 'deposit' ? 'Depósito Bancário' : item.key === 'pix' ? 'Pix' : item.key === 'cash' ? 'Dinheiro' : 'Cartão de Crédito'}
                            </Text>
                        </HStack>
                    ))
                }


                <Button
                    mt={6}
                    title={isActive ? "Desativar anúncio" : "Reativar anúncio"}
                    variant={isActive ? "gray1" : "blue"}
                    iconName="power"
                    isLoading={isLoading}
                    onPress={handleInactiveOrActiveProduct}
                />

                <Button
                    title="Excluir anúncio"
                    variant='gray5'
                    iconName="trash-can-outline"
                    mt={2}
                    isLoading={isLoading}
                    onPress={handleRemoveProduct}
                />
            </VStack>
        </ScrollView>
    )
}