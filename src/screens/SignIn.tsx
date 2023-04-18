import { Center, Heading, ScrollView, Text, VStack } from "native-base";

import LogoSvg from '@assets/logo.svg'

export function SignIn() {
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <VStack
                py={20}
                px={10}
                rounded="3xl"
                bg="gray.6"
            >
                <Center
                    mt={8}
                >
                    <LogoSvg />

                    <Heading
                        fontSize='4xl'
                        fontWeight="bold"
                        fontFamily="heading"
                        color='gray.1'
                        mt={2}
                    >
                        marketspace
                    </Heading>

                    <Text
                        shadow="9"
                        color='gray.3'
                    >
                        Seu espaço de compra e venda
                    </Text>

                    <Text
                        mt={20}
                        color={'gray.2'}
                    >
                        Acesse sua conta
                    </Text>


                </Center>
            </VStack>

            <VStack
                p={10}
                flex={1}
            >
                <Center>
                    <Text>Ainda não tem acesso</Text>
                </Center>
            </VStack>
        </ScrollView>
    )
}