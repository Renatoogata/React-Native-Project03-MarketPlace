import { Center, Heading, ScrollView, Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";

import LogoSvg from '@assets/logo.svg'

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

export function SignIn() {
    const navigation = useNavigation<AuthNavigatorRoutesProps>()

    function handleSignUp() {
        navigation.navigate('signUp')
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <VStack
                py={16}
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

                    <Input
                        mt={4}
                        placeholder="E-mail"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Input
                        placeholder="Senha"
                        iconName="eye-outline"
                    />

                    <Button
                        title="Entrar"
                        variant="blue"
                    />

                </Center>
            </VStack>

            <VStack
                p={10}
                flex={1}
            >
                <Center>
                    <Text>Ainda não tem acesso?</Text>
                </Center>

                <Button
                    mt={4}
                    title="Criar uma conta"
                    variant="gray5"
                    onPress={handleSignUp}
                />
            </VStack>
        </ScrollView>
    )
}