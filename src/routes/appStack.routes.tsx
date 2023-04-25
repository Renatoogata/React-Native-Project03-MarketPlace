import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Product } from "@screens/Product";
import { AppRoutes } from "./app.routes";
import { CreateProduct, PhotoProps } from "@screens/CreateProduct";
import { CreateProductPreview } from "@screens/CreateProductPreview";
import { MyProductById } from "@screens/MyProductById";
import { EditProduct } from "@screens/EditProduct";


type AppRoutes = {
    product: { productId: string }
    bottonTabRoutes: undefined
    createProduct: undefined
    myProductById: { productId: string }
    createProductPreview: {
        productImages: PhotoProps[],
        name: string,
        description: string,
        isNew: string,
        price: string,
        acceptTrade: boolean,
        paymentMethods: string[],
    }
    editProduct: { productId: string }
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

            <Screen
                name="createProduct"
                component={CreateProduct}
            />

            <Screen
                name="createProductPreview"
                component={CreateProductPreview}
            />

            <Screen
                name="myProductById"
                component={MyProductById}
            />

            <Screen
                name="editProduct"
                component={EditProduct}
            />
        </Navigator>
    )
}
