
import { Image, IImageProps, Box, HStack, Text, VStack } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { UserPhoto } from './UserPhoto';

import { useAuth } from '@hooks/useAuth';
import { api } from "@services/api";

import Avatar from '@assets/avatar.png'
import { ProductType } from "./ProductType";


type Props = IImageProps & TouchableOpacityProps & {
    avatar: string | undefined;
    isNew: boolean;
    name: string;
    price: number;
};


export function ProductCard({ avatar, isNew, name, price, ...rest }: Props) {
    const { user } = useAuth();

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
                        <UserPhoto
                            source={{ uri: `${api.defaults.baseURL}/images/${avatar}` }}
                            size={8}
                            alt="Foto de perfil"
                            border={1.5}
                            borderColor='SECONDARY'
                            ml={1}
                            mt={1}
                        />

                        <ProductType
                            isNew={isNew}
                        />
                    </HStack>
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