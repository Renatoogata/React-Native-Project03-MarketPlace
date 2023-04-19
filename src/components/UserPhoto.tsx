import { TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Box, Icon } from 'native-base'
import { Image, IImageProps } from "native-base";

type Props = IImageProps & {
    size: number
}

export function UserPhoto({ size, ...rest }: Props) {
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
            <TouchableOpacity>
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
        </Box>
    )
}