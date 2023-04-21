import { Text } from "native-base";

type Props = {
    name: string;
    type: 'NEW' | 'USED'
}

export function ProductType({ name, type }: Props) {
    return (
        <Text
            bg={type === 'NEW' ? 'blue.regular' : 'gra.2'}
            color='gray.7'
            fontFamily='heading'
            fontSize='xs'
            w={14}
            h={5}
            rounded='2xl'
            textAlign='center'
            mt={1}
            mr={1}
        >
            {name}
        </Text>
    )
}