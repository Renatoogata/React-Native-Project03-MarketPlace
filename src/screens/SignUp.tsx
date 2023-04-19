import { Box, Center, Heading, ScrollView, Text, VStack } from "native-base";

import MiniLogoSvg from '@assets/miniLogo.svg'

import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";


export function SignUp() {
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            bg="gray.6"
        >
            <VStack
                py={10}
                px={12}
            >
                <Center
                    mt={4}
                >
                    <MiniLogoSvg />

                    <Heading
                        mt={4}
                        fontSize="lg"
                        fontWeight="bold"
                        fontFamily="heading"
                        color="gray.1"
                        letterSpacing="2xl"
                    >
                        Boas vindas!
                    </Heading>

                    <Text
                        mt={2}
                        textAlign="center"
                        color="gray.2"
                    >
                        Crie sua conta e use o espaço para comprar itens variados e vender seus produtos
                    </Text>

                    <Box
                        mt={7}
                    >
                        <UserPhoto
                            source={{ uri: 'https://img.assinaja.com/upl/lojas/mundosinfinitos/imagens/foto-one-piece.png' }}
                            alt="Foto de Perfil"
                            size={24}
                        />
                    </Box>

                    <Input
                        mt={4}
                        placeholder="Nome"
                    />

                    <Input
                        placeholder="E-mail"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Input
                        placeholder="telefone"
                        keyboardType="number-pad"
                    />

                    <Input
                        placeholder="Senha"
                        iconName="eye-outline"
                    />

                    <Input
                        placeholder="Confirmar senha"
                        iconName="eye-outline"
                    />

                    <Button
                        mt={2}
                        title="Criar"
                        variant="gray1"
                    />

                    <Text
                        mt={8}
                    >
                        Já tem uma conta?
                    </Text>

                    <Button
                        mt={4}
                        title="Ir para o login"
                        variant="gray5"
                    />
                </Center>
            </VStack>

        </ScrollView>
    )
}