import { useState } from 'react';
import { Box, Icon } from 'native-base'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Image, IImageProps, useToast } from "native-base";

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'


type Props = IImageProps & TouchableOpacityProps & {
    size: number
}

export function UserPhoto({ size, ...rest }: Props) {
    const [photoIsLoading, setPhotoIsLoading] = useState(false);

    const toast = useToast();

    async function handleUserPhotoSelect() {
        setPhotoIsLoading(true)
        console.log('teste')
        try {
            const photoSelect = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true
            });

            if (photoSelect.canceled) {
                return;
            }

            if (photoSelect.assets[0].uri) {
                const PhotoInfo = await FileSystem.getInfoAsync(photoSelect.assets[0].uri)

                if (PhotoInfo.size && (PhotoInfo.size / 1024 / 1024) > 5) {
                    return toast.show({
                        title: 'Tamanho da Imagem invalido',
                        _title: { alignSelf: 'center' },
                        description: 'Essa Imagem é muito grande. Escolha uma de até 5 MB',
                        placement: 'top',
                        bgColor: 'red.light'
                    })
                }

                const fileExtension = photoSelect.assets[0].uri.split('.').pop();

                const photoFile = {
                    name: ``
                }
            }
        } catch (error) {

        }
    }

    return (
        <Box>
            <Image
                w={size}
                h={size}
                rounded="full"
                borderWidth={3}
                borderColor="blue.light"

                {...rest}
            />
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
                        onPress={handleUserPhotoSelect}
                    />
                </Box>
            </TouchableOpacity>
        </Box>
    )
}