import { Box, Center, Heading, ScrollView, Text, VStack, useToast, Skeleton } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from 'react-hook-form';

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import { api } from '@services/api';
import { useAuth } from "@hooks/useAuth";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';

import MiniLogoSvg from '@assets/miniLogo.svg'
import Avatar from '@assets/avatar.png'

import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { InputPassword } from "@components/InputPassword";
import { Button } from "@components/Button";
import { useState } from "react";
import { AppError } from "@utils/AppError";

type FormDataProps = {
    name: string;
    email_login: string;
    password: string;
    confirm_password: string;
    phone: string;
}

type UserImageProps = {
    selected: boolean;
    photo: {
        uri: string;
        name: string;
        type: string;
    };
};

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const signUpSchema = yup.object({
    name: yup.string().required('Digite o nome completo.'),
    email_login: yup.string().required('Informe o email.').email('Email digitado errado.'),
    password: yup.string().required('Informe a senha.'),
    confirm_password: yup.string().required('Confirme a senha.').oneOf([yup.ref('password')], 'A confirmação de senha não confere.'),
    phone: yup.string().required('Informe o número de telefone').matches(phoneRegExp, 'Número de telefone inválido.')
})

const PHOTO_SIZE = 24;

export function SignUp() {
    const [isLoading, setIsLoading] = useState(false);
    const [userImageSelected, setUserImageSelected] = useState({ selected: false } as UserImageProps);

    const toast = useToast();
    const { signIn } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    })

    const userForm = new FormData();

    const navigation = useNavigation<AuthNavigatorRoutesProps>();

    async function handleUserPhotoSelect() {
        try {
            setIsLoading(true)
            const photoSelect = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true
            });

            if (photoSelect.canceled) {
                return;
            }

            if (photoSelect.assets[0].uri) {
                const PhotoInfo = await FileSystem.getInfoAsync(photoSelect.assets[0].uri)

                if (PhotoInfo.size && (PhotoInfo.size / 1024 / 1024) > 5) {
                    return toast.show({
                        title: 'Tamanho da Imagem invalido',
                        _title: { alignSelf: 'center' },
                        description: 'Essa Imagem é muito grande. Escolha uma de até 5 MB',
                        placement: 'top',
                        bgColor: 'red.light'
                    })
                }

                const fileExtension = photoSelect.assets[0].uri.split('.').pop();

                const photoFile = {
                    name: `${fileExtension}`.toLowerCase(),
                    uri: photoSelect.assets[0].uri,
                    type: `${photoSelect.assets[0].type}/${fileExtension}`
                } as any

                setUserImageSelected({
                    selected: true,
                    photo: { ...photoFile }
                })

                toast.show({
                    title: 'Imagem selecionada com sucesso',
                    placement: 'top',
                    bgColor: 'blue.light'
                });
            }
        } catch (error) {
            throw (error)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleSignUp({ email_login, name, password, phone }: FormDataProps) {
        try {
            if (!userImageSelected.selected) {
                toast.show({
                    title: "Porfavor Selecione uma foto",
                    placement: "top",
                    bgColor: 'red.light'
                })
            }

            const userImage = {
                ...userImageSelected.photo,
                name: `${name}.${userImageSelected.photo.name}`.toLowerCase(),
            } as any

            userForm.append("avatar", userImage);
            userForm.append("name", name);
            userForm.append("email", email_login.toLowerCase());
            userForm.append("tel", phone);
            userForm.append("password", password)

            setIsLoading(true);

            await api.post("/users", userForm, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            await signIn(email_login, password);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Não foi possível criar a conta. Tente novamente mais tarde."

            if (isAppError) {
                toast.show({
                    title,
                    placement: 'top',
                    bgColor: 'red.light'
                })
            }
        } finally {
            setIsLoading(false);
        }
    }

    function handleSignIn() {
        navigation.goBack()
    }

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
                        {
                            isLoading ?
                                <Skeleton
                                    w={PHOTO_SIZE}
                                    h={PHOTO_SIZE}
                                    rounded="full"
                                    startColor="blue.light"
                                    speed={2.5}
                                /> :

                                <UserPhoto
                                    source={
                                        userImageSelected.selected
                                            ? { uri: userImageSelected.photo.uri }
                                            : Avatar
                                    }
                                    alt="Foto de Perfil"
                                    size={PHOTO_SIZE}
                                    onPress={handleUserPhotoSelect}
                                    iconEdit
                                    border={3}
                                />
                        }
                    </Box>

                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                mt={4}
                                placeholder="Nome"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email_login"
                        render={({ field: { onChange, value } }) => (
                            <Input
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
                        name="phone"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder="telefone"
                                keyboardType="number-pad"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.phone?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <InputPassword
                                placeholder="Senha"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="confirm_password"
                        render={({ field: { onChange, value } }) => (
                            <InputPassword
                                placeholder="Confirmar senha"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.confirm_password?.message}
                            />
                        )}
                    />

                    <Button
                        mt={2}
                        title="Criar"
                        variant="gray1"
                        onPress={handleSubmit(handleSignUp)}
                        isLoading={isLoading}
                    />

                    <Text
                        mt={12}
                    >
                        Já tem uma conta?
                    </Text>

                    <Button
                        mt={4}
                        title="Ir para o login"
                        variant="gray5"
                        onPress={handleSignIn}
                    />
                </Center>
            </VStack>

        </ScrollView>
    )
}