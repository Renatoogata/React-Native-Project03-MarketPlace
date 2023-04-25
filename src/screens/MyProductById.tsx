import { HStack, Text } from "native-base";
import { useRoute } from "@react-navigation/native";


type RouteParamsProps = {
    productId: string
}

export function MyProductById() {
    const route = useRoute()
    const { productId } = route.params as RouteParamsProps;
    console.log(productId)

    return (
        <HStack>
            <Text>Hola</Text>
        </HStack>
    )
}