
import { Image, IImageProps, Box, HStack, Text, VStack } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { UserPhoto } from './UserPhoto';

import { useAuth } from '@hooks/useAuth';
import { api } from "@services/api";

import Avatar from '@assets/avatar.png'
import { ProductType } from "./ProductType";


type Props = IImageProps & TouchableOpacityProps & {
    avatar?: string;
    isNew: boolean;
    name: string;
    price: number;
    isActive: boolean;
};


export function ProductCard({ avatar, isNew, name, price, isActive = true, ...rest }: Props) {
    return (
        <VStack
            mb={4}
        >
            <Box
                width={150}
                height={100}
            >
                <TouchableOpacity
                    {...rest}
                >
                    <Image
                        alt="Foto do Produto"
                        w={150}
                        h={100}
                        rounded="md"
                        position="absolute"

                        {...rest}
                    />
                    <HStack
                        justifyContent='space-between'
                    >
                        {
                            !avatar ? <Box /> :
                                <UserPhoto
                                    source={{ uri: `${api.defaults.baseURL}/images/${avatar}` }}
                                    size={8}
                                    alt="Foto de perfil"
                                    border={1.5}
                                    borderColor='SECONDARY'
                                    ml={1}
                                    mt={1}
                                />
                        }

                        <ProductType
                            isNew={isNew}
                        />
                    </HStack>
                    {
                        isActive ? null :
                            <>
                                <Box
                                    width={150}
                                    height={100}
                                    bg='gray.2'
                                    position='absolute'
                                    opacity={0.5}
                                    rounded="md"
                                />
                                <Text
                                    mt={12}
                                    ml={2}
                                    fontSize='xs'
                                    fontFamily='heading'
                                    color='gray.7'
                                >
                                    ANÚNCIO DESATIVADO
                                </Text>
                            </>
                    }
                </TouchableOpacity>
            </Box>
            <Text
                color='gray.2'
                fontSize='sm'
                numberOfLines={1}
                flexShrink={1}
            >
                {name}
            </Text>

            <Text
                fontSize='xs'
                fontFamily='heading'
                mt={-1}
            >
                R$
                {' '}
                <Text
                    fontSize='sm'
                >
                    {price}
                </Text>
            </Text>
        </VStack>
    )
}