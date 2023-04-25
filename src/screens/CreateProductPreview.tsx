import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { Center, Text, VStack, Image, Box, HStack, Icon, ScrollView } from "native-base"

import Carousel from 'react-native-reanimated-carousel';
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { api } from "@services/api";
import { UserDTO } from "src/dtos/UserDTO";

import { useNavigation, useRoute } from "@react-navigation/native";

import { PhotoProps } from "./CreateProduct";
import { Loading } from "@components/Loading";
import { UserPhoto } from "@components/UserPhoto";

import Avatar from '@assets/avatar.png'
import { Button } from "@components/Button";


type RouteParamsProps = {
    productImages: PhotoProps[],
    name: string,
    description: string,
    isNew: string,
    price: string,
    acceptTrade: boolean,
    paymentMethods: string[],
}


export function CreateProductPreview() {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<UserDTO>({} as UserDTO)

    const route = useRoute();
    const avatar = user.avatar;
    const navigation = useNavigation()

    const { productImages, name, description, isNew, price, acceptTrade, paymentMethods } = route.params as RouteParamsProps


    console.log("Testezada ", description)

    const width = Dimensions.get('window').width;

    function handleGoBack() {
        navigation.goBack();
    }

    async function handleCreateProduct() {

    }

    async function fetchUser() {
        try {
            setIsLoading(true)
            const user = await api.get(`${api.defaults.baseURL}/users/me`);
            setUser(user.data)
        } catch (error) {
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    return (
        <>
            <ScrollView
                flex={1}
                bg='gray.6'
                showsVerticalScrollIndicator={false}
                _contentContainerStyle={{ paddingBottom: 30 }}
            >
                <Center
                    bg='blue.light'
                    paddingTop={16}
                >
                    <Text
                        fontFamily='heading'
                        fontSize='md'
                        color='gray.7'
                    >
                        Pré visualização do anúncio
                    </Text>

                    <Text
                        fontSize='sm'
                        mb={4}
                        color='gray.7'
                    >
                        É assim qque seu produto vai aparecer
                    </Text>
                </Center>

                <View
                >
                    <Carousel
                        loop
                        width={width}
                        height={260}
                        autoPlay={productImages.length > 1}
                        data={productImages}
                        scrollAnimationDuration={2000}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: item.uri }}
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
                            {user.name}
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
                        {isNew === "new" ? "NOVO" : "USADO"}
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
                            {name}
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
                                {price}
                            </Text>
                        </Text>
                    </HStack>

                    <Text
                        mt={1}
                        fontSize='sm'
                        color='gray.2'
                        numberOfLines={5}
                        flexShrink={1}
                    >
                        {description}
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
                            {acceptTrade ? "Sim" : "Não"}
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
                            <HStack alignItems='center' key={item}>
                                <Icon
                                    as={MaterialCommunityIcons}
                                    name={item === 'boleto' ? "barcode-scan" : item === 'deposit' ? "bank-outline" : item === 'pix' ? "qrcode-plus" : item === "cash" ? "cash" : "credit-card-outline"}
                                    size={4}
                                    mr={2}
                                />

                                <Text
                                    color='gray.2'
                                    numberOfLines={1}
                                    flexShrink={1}
                                >
                                    {item === 'boleto' ? "boleto" : item === 'deposit' ? 'Depósito Bancário' : item === 'pix' ? 'Pix' : item === 'cash' ? 'Dinheiro' : 'Cartão de Crédito'}
                                </Text>
                            </HStack>
                        ))
                    }
                </VStack>
            </ScrollView>

            <HStack
                px={6}
                py={5}
                bg='white'
                w='full'

            >
                <Button
                    title="Cancelar"
                    variant='gray5'
                    flex={1}
                    mr={2}
                    onPress={handleGoBack}
                />

                <Button
                    title="Avançar"
                    variant='gray1'
                    flex={1}
                    isLoading={isLoading}
                    onPress={(handleCreateProduct)}
                />
            </HStack>
        </>
    )
}