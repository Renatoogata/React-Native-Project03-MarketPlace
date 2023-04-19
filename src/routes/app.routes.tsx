import { Alert, Platform } from 'react-native';
import { useTheme } from "native-base";
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

import { useAuth } from '@hooks/useAuth';

import { Home } from '@screens/Home';
import { MyProducts } from '@screens/MyProducts';
import { Product } from '@screens/Product';

import HomeIcon from '@assets/IconHome.svg'
import MyProductsIcon from '@assets/IconMyProducts.svg'
import LogOutIcon from '@assets/IconLogOut.svg'
import { Loading } from '@components/Loading';
import { useEffect } from 'react';


type AppRoutes = {
    home: undefined,
    product: { productId: string }
    myproducts: undefined
    logout: undefined
}

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
    const { colors, sizes } = useTheme();
    const iconSize = sizes[6];
    const { signOutMenu } = useAuth()

    return (
        <Navigator screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: colors.gray[1],
            tabBarInactiveTintColor: colors.gray[4],
            tabBarStyle: {
                backgroundColor: colors.gray[7],
                borderTopWidth: 0,
                height: Platform.OS === "android" ? 'auto' : 96,
                paddingBottom: sizes[8],
                paddingTop: sizes[8],
            }
        }}>
            <Screen
                name='home'
                component={Home}
                options={{
                    tabBarIcon: ({ color }) => (
                        <HomeIcon
                            fill={color}
                            width={iconSize}
                            height={iconSize}
                        />
                    )
                }}
            />

            <Screen
                name='myproducts'
                component={MyProducts}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MyProductsIcon
                            fill={color}
                            width={iconSize}
                            height={iconSize}
                        />
                    )
                }}
            />

            <Screen
                name='logout'
                component={Home}
                options={{
                    tabBarIcon: () => (
                        <LogOutIcon
                            fill={colors.red['light']}
                            width={iconSize}
                            height={iconSize}
                            onPress={signOutMenu}
                        />
                    )
                }}
            />

            <Screen
                name='product'
                component={Product}
                options={{
                    tabBarButton: () => null
                }}
            />
        </Navigator>
    )
}