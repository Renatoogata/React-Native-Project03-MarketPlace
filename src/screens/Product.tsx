import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Box, HStack, Icon, Text, VStack } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";

import { AntDesign } from '@expo/vector-icons'
import { CarouselImageProduct } from "@components/CarouselImageProduct";

import { api } from "@services/api";

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { ProductDTO } from "src/dtos/ProductDTO";
import { UserPhoto } from "@components/UserPhoto";

import Avatar from '@assets/avatar.png'
import { ProductType } from "@components/ProductType";



type RouteParamsProps = {
    productId: string
}

export function Product() {
    const route = useRoute()
    const navigation = useNavigation<AppNavigatorRoutesProps>()
    const { productId } = route.params as RouteParamsProps;

    const [product, setProduct] = useState<ProductDTO>({} as ProductDTO);

    async function fetchProduct() {
        try {
            const response = await api.get(`/products/${productId}`)
            setProduct(response.data);

            console.log(response.data)
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
            px={6}
            pt={12}
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

            <Box
                ml={-6}
                pt={4}
            >
                <CarouselImageProduct
                    productId={productId}
                />
            </Box>

            <HStack
                mt={340}
                alignItems='center'
            >
                <UserPhoto
                    source={
                        avatar
                            ? { uri: `${api.defaults.baseURL}/images/${avatar}` }
                            : Avatar
                    }
                    alt="foto de perfil"
                    size={8}
                    border={2}
                />

                <Text
                    ml={2}
                    color='gray.1'
                    fontSize='md'
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
            >
                NOVO
            </Text>
        </VStack>
    )
}