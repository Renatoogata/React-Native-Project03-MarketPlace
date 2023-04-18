import { FormControl, IInputProps, Input as NativeBaseInput } from "native-base";


type Props = IInputProps & {
    errorMessage?: string | null
}

export function Input({ errorMessage = null, isInvalid, ...rest }: Props) {
    const invalid = !!errorMessage || isInvalid;

    return (
        <FormControl
            isInvalid={invalid}
            mb={4}
        >
            <NativeBaseInput
                bg="gray.7"
                h={12}
                px={4}
                borderWidth={0}
                fontSize='md'
                color="gray.2"
                fontFamily="body"

                isInvalid={invalid}
                _invalid={{
                    borderWidth: 1,
                    borderColor: "red.light"
                }}

                placeholderTextColor="gray.3"

                {...rest}
            />

            <FormControl.ErrorMessage _text={{ color: 'red.light' }}>
                {errorMessage}
            </FormControl.ErrorMessage>
        </FormControl>
    )
}