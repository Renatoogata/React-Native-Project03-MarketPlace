import { Text } from "native-base";

type Props = {
    isNew: boolean
}

export function ProductType({ isNew, ...rest }: Props) {
    return (
        <Text
            bg={isNew === true ? 'blue.regular' : 'gray.2'}
            color='gray.7'
            fontFamily='heading'
            fontSize='xs'
            w={14}
            h={5}
            rounded='2xl'
            textAlign='center'
            mt={1}
            mr={1}

            {...rest}
        >
            {isNew === true ? "NOVO" : "USADO"}
        </Text>

    )
}