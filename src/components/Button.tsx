import { Button as ButtonNativeBase, HStack, IButtonProps, Icon, Text } from "native-base";
import { MaterialCommunityIcons } from '@expo/vector-icons'

type Props = IButtonProps & {
    title: string;
    variant?: 'gray5' | 'blue' | 'gray1'
    iconName?: string | null;
}

export function Button({ title, variant, iconName = null, ...rest }: Props) {
    return (
        <ButtonNativeBase
            w='full'
            h={12}
            bg={variant === 'gray5' ? 'gray.5' : variant === 'blue' ? 'blue.light' : 'gray.1'}
            rounded="sm"
            _pressed={{
                bg: variant === 'gray5' ? 'gray.4' : variant === 'blue' ? 'blue.regular' : 'gray.3'
            }}

            {...rest}
        >
            <HStack
                alignItems='center'
            >
                {
                    iconName === null ? <></> :
                        <Icon
                            as={MaterialCommunityIcons}
                            name={iconName}
                            color={variant === 'gray5' ? 'gray.3' : variant === 'blue' ? 'gray.6' : 'gray.6'}
                            size={4}
                            mr={2}
                        />
                }


                <Text
                    color={variant === 'gray5' ? 'gray.2' : variant === 'blue' ? 'gray.7' : 'gray.7'}
                    fontFamily="heading"
                    fontSize="sm"
                >
                    {title}
                </Text>

            </HStack>
        </ButtonNativeBase>
    )
}