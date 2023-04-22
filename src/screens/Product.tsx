import { TouchableOpacity } from "react-native";
import { Icon, Text, VStack } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";

import { AntDesign } from '@expo/vector-icons'


type RouteParamsProps = {
    productId: string
}

export function Product() {
    const route = useRoute()
    const navigation = useNavigation()

    const { productId } = route.params as RouteParamsProps;

    function handleGoBack() {
        navigation.goBack()
    }

    return (
        <VStack
            bg='gray.6'
            flex={1}
            px={6}
            pt={12}
        >
            <TouchableOpacity
                onPress={handleGoBack}
            >
                <Icon
                    as={AntDesign}
                    name="arrowleft"
                    size={7}
                    color='gray.1'
                />
            </TouchableOpacity>
        </VStack>
    )
}