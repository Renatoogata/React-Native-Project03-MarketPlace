import { Text, VStack } from "native-base";

import { useNavigation, useRoute } from "@react-navigation/native";

import { PhotoProps } from "./CreateProduct";


type RouteParamsProps = {
    productImages: PhotoProps[],
    name: string,
    description: string,
    isNew: string,
    price: string,
    acceptTrade: boolean,
    paymentMethods: string[],
}


export function CreateProductPreview() {
    const route = useRoute();

    const { productImages, name, description, isNew, price, acceptTrade, paymentMethods } = route.params as RouteParamsProps

    console.log("Testezada ", productImages, name, description, isNew, price, acceptTrade, paymentMethods)

    return (
        <VStack
            flex={1}
        >
            <Text
                alignItems='center'
                justifyContent='center'
            >
                Preview
            </Text>
        </VStack>
    )
}