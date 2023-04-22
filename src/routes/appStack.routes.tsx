import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Product } from "@screens/Product";
import { AppRoutes } from "./app.routes";

type AppRoutes = {
    product: { productId: string }
    bottonTabRoutes: undefined
}

export type AppNavigatorStackRoutesProps = NativeStackNavigationProp<AppRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AppRoutes>()

export function AppRoutesStack() {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen
                name="bottonTabRoutes"
                component={AppRoutes}
            />

            <Screen
                name="product"
                component={Product}
            />


        </Navigator>
    )
}
