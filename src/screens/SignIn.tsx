import { useState } from "react";
import { Center, Heading, ScrollView, Text, VStack, useToast } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from "@hooks/useAuth";

import LogoSvg from '@assets/logo.svg'

import { AppError } from "@utils/AppError";

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

type FormDataProps = {
    email_login: string;
    password: string;
}

const logInSchema = yup.object({
    email_login: yup.string().required('Informe o email.').email('Email digitado errado.'),
    password: yup.string().required('Informe a senha.')
})

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast();
    const { signIn } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(logInSchema)
    })

    const navigation = useNavigation<AuthNavigatorRoutesProps>()


    async function handleLogin({ email_login, password }: FormDataProps) {
        try {
            setIsLoading(true);
            await signIn(email_login, password);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível entrar. Tente mais tarde.'

            setIsLoading(false);
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.light',
            })
        }
    }

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
                rounded="3xl"
                px={12}
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


                    <Controller
                        control={control}
                        name="email_login"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                mt={4}
                                placeholder="E-mail"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email_login?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder="Senha"
                                iconName="eye-outline"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />

                    <Button
                        title="Entrar"
                        variant="blue"
                        onPress={handleSubmit(handleLogin)}
                        isLoading={isLoading}
                    />

                </Center>
            </VStack>

            <VStack
                p={12}
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