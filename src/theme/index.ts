import { extendTheme } from "native-base";

export const THEME = extendTheme({
    colors: {
        blue: {
            'light': '#647AC7',
            'regular': '#364d9d',
        },
        red: {
            'light': '#EE7979'
        },
        gray: {
            7: '#F7F7F8',
            6: '#EDECEE',
            5: '#D9D8DA',
            4: '#9F9BA1',
            3: '#5F5B62',
            2: '#3E3A40',
            1: '#1A181B',
        },
        white: '#FFFFFF',
    },

    fonts: {
        heading: 'Karla_700Bold',
        body: 'Karla_400Regular'
    },

    fontSizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 20,
        xl: 24,
    },

    sizes: {
        11: 42,
        14: 56,
        33: 148
    }
})