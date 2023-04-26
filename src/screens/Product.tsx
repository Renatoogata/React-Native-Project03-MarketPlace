import { useEffect, useState } from "react";
import { TouchableOpacity, Linking } from "react-native";
import { Box, HStack, Icon, ScrollView, Text, VStack } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";

import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { CarouselImageProduct } from "@components/CarouselImageProduct";

import { api } from "@services/api";

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { UserPhoto } from "@components/UserPhoto";
import Avatar from '@assets/avatar.png'

import { ProductDTO } from "src/dtos/ProductDTO";
import { PaymentMethodDTO } from "src/dtos/PaymentMethodDTO";

import { Button } from "@components/Button";
import { useAuth } from "@hooks/useAuth";



type RouteParamsProps = {
    productId: string
}

export function Product() {
    const route = useRoute()
    const navigation = useNavigation<AppNavigatorRoutesProps>()
    const { productId } = route.params as RouteParamsProps;

    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState<ProductDTO>({} as ProductDTO);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDTO[]>([]);

    async function handleContactNumber() {
        try {
            setIsLoading(true)
            await Linking.openURL(`whatsapp://send?text=${product.name}&phone=${product.user?.tel}`)
        } catch (error) {
            throw (error)
        } finally {
            setIsLoading(false)
        }

    }

    async function fetchProduct() {
        try {
            const response = await api.get(`/products/${productId}`)
            setProduct(response.data);
            setPaymentMethods(response.data.payment_methods)
        } catch (error) {
            throw (error)
        }
    }
    const avatar = product.user?.avatar

    useEffect(() => {
        fetchProduct()
    }, [productId])

    function handleGoBack() {
        navigation.navigate('home')
    }

    return (
        <VStack
            bg='gray.6'
            flex={1}
        >
            <ScrollView
                mt={16}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                <Box
                    px={6}
                >
                    <TouchableOpacity
                        onPress={handleGoBack}
                    >
                        <Icon
                            as={AntDesign}
                            name="arrowleft"
                            size={7}
                            color='gray.1'
                        />
                    </TouchableOpacity>
                </Box>
                <Box

                    mt={4}
                >
                    <CarouselImageProduct
                        productId={productId}
                    />
                </Box>
                <VStack
                    px={6}
                >
                    <HStack
                        alignItems='center'
                        mt={5}
                    >
                        <UserPhoto
                            source={
                                avatar
                                    ? { uri: `${api.defaults.baseURL}/images/${avatar}` }
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

                    <Box>
                        <Text
                            mt={2}
                            fontSize='sm'
                            color='gray.2'
                            numberOfLines={5}
                            flexShrink={1}
                        >
                            {product.description}
                        </Text>
                    </Box>


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

                    <VStack
                        mt={3}
                    >
                        <Text
                            fontFamily='heading'
                            color='gray.2'
                            mb={2}
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

                    </VStack>
                </VStack>
            </ScrollView>

            <HStack
                py={2}
                px={6}
                bg='rgba(100, 122, 199, 0.2)'
                justifyContent='space-between'
                alignItems='center'
            >
                <Text
                    fontFamily='heading'
                    color='blue.regular'
                    numberOfLines={1}
                    flexShrink={1}

                >
                    R$ {' '}
                    <Text
                        fontSize='lg'
                        numberOfLines={1}
                        flexShrink={1}
                    >
                        {product.price}
                    </Text>
                </Text>

                <Button
                    iconName="whatsapp"
                    title="Entrar em contato"
                    variant='blue'
                    w={180}
                    isLoading={isLoading}
                    onPress={handleContactNumber}
                />
            </HStack>
        </VStack>
    )
}