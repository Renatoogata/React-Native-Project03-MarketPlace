import { useState } from 'react';
import { Box, Icon } from 'native-base'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Image, IImageProps } from "native-base";

type Props = IImageProps & TouchableOpacityProps & {
    size: number
    border: number
    iconEdit?: boolean
}

export function UserPhoto({ size, iconEdit = false, border, ...rest }: Props) {
    return (
        <Box>
            <Image
                w={size}
                h={size}
                rounded="full"
                borderWidth={border}
                borderColor="blue.light"

                {...rest}
            />
            {
                iconEdit ?
                    <TouchableOpacity
                        {...rest}
                    >
                        <Box
                            backgroundColor='blue.light'
                            position='absolute'
                            p={2.5}
                            rounded='full'
                            bottom={1}
                            right={-4}
                        >
                            <Icon
                                as={MaterialCommunityIcons}
                                name='pencil'
                                color='gray.7'
                                size={4}
                            />
                        </Box>
                    </TouchableOpacity>
                    : null
            }
        </Box>
    )
}