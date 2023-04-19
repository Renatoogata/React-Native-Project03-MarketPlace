import { Box, FormControl, HStack, Icon, IInputProps, Input as NativeBaseInput } from "native-base";
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native";
import { useState } from "react";


type Props = IInputProps & {
    errorMessage?: string | null;
    iconName?: string | null;
}

export function Input({ errorMessage = null, isInvalid, iconName = null, ...rest }: Props) {
    const [showPassword, setShowPassword] = useState(true);

    const invalid = !!errorMessage || isInvalid;

    function handleHideOrShowPassword() {
        if (showPassword) {
            setShowPassword(false)
        } else {
            setShowPassword(true)
        }
    }

    return (
        <FormControl
            isInvalid={invalid}
            mb={4}
        >
            <HStack>
                <NativeBaseInput
                    flex={1}
                    bg="white"
                    h={11}
                    px={4}
                    borderWidth={0}
                    fontSize='md'
                    color="gray.2"
                    fontFamily="body"
                    rounded="md"
                    secureTextEntry={iconName! != null ? showPassword : false}

                    isInvalid={invalid}
                    _invalid={{
                        borderWidth: 1,
                        borderColor: "red.light"
                    }}

                    placeholderTextColor="gray.4"

                    _focus={{
                        bg: 'gray.7'
                    }}

                    {...rest}
                />

                <Box
                    position='absolute'
                    right={1}
                    my={3.5}
                    mx={4}
                >
                    <TouchableOpacity onPress={handleHideOrShowPassword}>
                        {
                            iconName === null ? null :
                                <Icon
                                    as={MaterialCommunityIcons}
                                    name={showPassword ? iconName : 'eye-off-outline'}
                                    color='gray.3'
                                    size={5}
                                />

                        }
                    </TouchableOpacity>
                </Box>
            </HStack>
            <FormControl.ErrorMessage _text={{ color: 'red.light' }} mt={0}>
                {errorMessage}
            </FormControl.ErrorMessage>
        </FormControl>
    )
}