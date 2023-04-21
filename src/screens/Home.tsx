import { useState } from "react";
import { Box, FlatList, HStack, Icon, ScrollView, Text, useTheme, VStack } from "native-base";
import { MaterialCommunityIcons, SimpleLineIcons, Entypo } from '@expo/vector-icons'

import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";

import Avatar from '@assets/avatar.png'
import MyProductsIcon from '@assets/IconMyProducts.svg'

import { UserPhoto } from "@components/UserPhoto";
import { Button } from "@components/Button";
import { TouchableOpacity } from "react-native";
import { Input } from "@components/Input";
import { ProductCard } from "@components/ProductCard";


export function Home() {
    const [products, useProducts] = useState(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'])

    const { colors } = useTheme();
    const { user } = useAuth();


    return (
        <VStack
            pt={16}
            px={6}
            flex={1}
            bg='gray.6'
        >
            <HStack>
                <UserPhoto
                    source={
                        user.avatar
                            ? { uri: `${api.defaults.baseURL}/images/${user.avatar}` }
                            : Avatar
                    }
                    alt="perfil"
                    size={10}
                    border={2}
                />
                <VStack
                    ml={2}
                    flex={1}
                >
                    <Text
                        numberOfLines={1}
                        flexShrink={1}
                    >
                        Boas vindas,
                    </Text>
                    <Text
                        fontFamily='heading'
                        numberOfLines={1}
                        flexShrink={1}
                    >
                        {user.name}
                    </Text>
                </VStack>
                <Button
                    title="Criar anúncio"
                    width={33}
                    variant='gray1'
                    iconName="plus"
                />
            </HStack>
            <Text
                mt={10}
                color='gray.3'
            >
                Seus produtos anunciados para venda
            </Text>
            <HStack
                style={{ backgroundColor: 'rgba(100, 122, 199, 0.1)' }}
                mt={3}
                p={3}
                alignItems='center'
                rounded='md'
            >
                <MyProductsIcon
                    fill={colors.blue['regular']}
                    width={24}
                    height={24}
                />
                <VStack
                    flex={1}
                    ml={3}
                    justifyContent='space-around'
                >
                    <Text
                        fontSize='2xl'
                        fontFamily='heading'
                        mb={-1}
                    >
                        4
                    </Text>
                    <Text>
                        anúncios ativos
                    </Text>
                </VStack>

                <TouchableOpacity>
                    <HStack
                        alignItems='center'
                    >
                        <Text
                            color='blue.regular'
                            fontFamily='heading'
                        >
                            Meus Anúncios
                        </Text>

                        <Icon
                            as={MaterialCommunityIcons}
                            name="arrow-right"
                            color='blue.regular'
                            size={4}
                            ml={2}
                        />
                    </HStack>
                </TouchableOpacity>
            </HStack>
            <Text
                pt={8}
                color='gray.3'
            >
                Compre produtos variados
            </Text>
            <Box
                mt={2}
            >
                <Box
                    flexDirection='row'
                    position='absolute'
                    zIndex={1}
                    right={1}
                    mt={2}
                    mr={2}
                >
                    <TouchableOpacity>
                        <Icon
                            as={Entypo}
                            name="magnifying-glass"
                            size={7}
                            color='gray.2'
                        />
                    </TouchableOpacity>
                    <Box
                        w={0.8}
                        mx={3}
                        bg='gray.3'
                    ></Box>
                    <TouchableOpacity>
                        <Icon
                            as={SimpleLineIcons}
                            name='equalizer'
                            size={6}
                            color='gray.2'
                        />
                    </TouchableOpacity>
                </Box>
                <Input
                    placeholder="Buscar Anúncio"
                />
            </Box>


            <FlatList
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                data={products}
                keyExtractor={item => item}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <ProductCard
                        source={{ uri: 'https://wpblog.semexe.com/wp-content/uploads/2021/12/6_Ext_Ultravox-SSL-DIsc-Comp_SwiftCarbon_2021-1024x683.jpeg' }}
                    />
                )}
            />
        </VStack>
    )
}