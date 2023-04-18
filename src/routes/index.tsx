import { useTheme } from 'native-base'
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { AuthRoutes } from "./auth.routes";

export function Routes() {
    const { colors } = useTheme();

    const theme = DefaultTheme;
    theme.colors.background = colors.gray[200]

    return (
        <NavigationContainer
            theme={theme}
        >
            <AuthRoutes />
        </NavigationContainer>
    )
}