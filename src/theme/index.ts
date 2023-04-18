import { extendTheme } from "native-base";

export const THEME = extendTheme({
    colors: {
        blue: {
            500: '#647AC7',
            700: '#364d9d',
        },
        red: {
            200: '#EE7979'
        },
        gray: {
            100: '#F7F7F8',
            200: '#EDECEE',
            300: '#D9D8DA',
            400: '#9F9BA1',
            500: '#5F5B62',
            600: '#3E3A40',
            700: '#1A181B',
        },
    },

    fonts: {
        heading: 'Karla_700Bold ',
        body: 'Karla_400Regular'
    },

    fontSizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 20,
        xl: 24,
    },
})