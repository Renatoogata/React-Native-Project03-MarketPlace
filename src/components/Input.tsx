import { Box, FormControl, HStack, Icon, IInputProps, Input as NativeBaseInput } from "native-base";
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native";


type Props = IInputProps & {
    errorMessage?: string | null;
}

export function Input({ errorMessage = null, isInvalid, ...rest }: Props) {
    const invalid = !!errorMessage || isInvalid;

    return (
        <FormControl
            isInvalid={invalid}
            mb={4}
        >
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
            <FormControl.ErrorMessage _text={{ color: 'red.light' }} mt={0}>
                {errorMessage}
            </FormControl.ErrorMessage>
        </FormControl>
    )
}