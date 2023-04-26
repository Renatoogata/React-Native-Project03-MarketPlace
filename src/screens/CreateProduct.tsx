import { useState } from "react";
import { Box, HStack, Icon, Text, useToast, Image, Checkbox, Radio, ScrollView, Switch, Skeleton } from "native-base";
import { TouchableOpacity } from "react-native";


import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'

import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import { AppNavigatorStackRoutesProps } from "@routes/appStack.routes";
import { useNavigation } from "@react-navigation/native";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Loading } from "@components/Loading";

export type PhotoProps = {
    uri: string;
    name: string;
    type: string;
}

type FormDataProps = {
    name: string;
    description: string;
    price: string;
}

const signUpSchema = yup.object({
    name: yup.string().min(3).required('Digite o nome do item.'),
    description: yup.string().min(10).max(200).trim().required('Digite a descrição do produto(min:10, max:200)'),
    price: yup.number().required('Informe o valor do produto'),
})

const PHOTO_SIZE = 100;

export function CreateProduct() {
    const [isLoading, setIsLoading] = useState(false);
    const [productImages, setProductImages] = useState<PhotoProps[]>([]);
    const [isNew, setIsnew] = useState("new");
    const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
    const [acceptTrade, setAcceptTrade] = useState(false);

    const navigation = useNavigation<AppNavigatorStackRoutesProps>();
    const toast = useToast();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    })


    function handleGoBack() {
        navigation.goBack();
    }

    async function handleUserPhotoSelect() {
        try {
            if (productImages.length < 3) {
                setIsLoading(true)
                const photoSelect = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 1,
                    aspect: [4, 3],
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

                    setProductImages((current) => { return [...current, photoFile] })

                    toast.show({
                        title: 'Imagem selecionada com sucesso',
                        placement: 'top',
                        bgColor: 'blue.light'
                    });
                }
            }

        } catch (error) {
            throw (error)
        } finally {
            setIsLoading(false)
        }
    }

    function handleImageRemove(image: PhotoProps) {
        const data = productImages.filter(item => item.uri !== image.uri)
        setProductImages(data);
    }

    function handleCreateProductPreview({ name, description, price }: FormDataProps) {
        try {
            setIsLoading(true);
            if (productImages.length === 0 || productImages.length > 4) {
                return toast.show({
                    title: "O aúncio deve conter de 1 a 3 fotos",
                    placement: 'top',
                    bgColor: 'red.light',
                })
            }

            if (paymentMethods.length === 0) {
                return toast.show({
                    title: "Seleciona pelo menos um método de pagamento",
                    placement: 'top',
                    bgColor: 'red.light'
                })
            }

            navigation.navigate('createProductPreview', {
                productImages,
                name,
                description,
                isNew,
                price,
                acceptTrade,
                paymentMethods,
            })
        } catch (error) {
            toast.show({
                title: "Não foi possível criar a preview do produto",
                placement: 'top',
                bgColor: 'red.light',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <ScrollView
                pt={16}
                px={6}
                mb={-10}
                flex={1}
                flexGrow={1}
                bg='gray.6'

                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <HStack
                    alignItems='center'
                    justifyContent='center'
                >
                    <TouchableOpacity
                        style={{ position: 'absolute', left: 1 }}
                        onPress={handleGoBack}
                    >
                        <Icon
                            as={AntDesign}
                            name="arrowleft"
                            size={7}
                            color='gray.1'
                        />
                    </TouchableOpacity>

                    <Text
                        fontFamily='heading'
                        fontSize='lg'
                    >
                        Criar anúncio
                    </Text>
                </HStack>

                <Text
                    mt={6}
                    fontSize="md"
                    fontFamily='heading'
                    color='gray.2'
                >
                    Imagens
                </Text>

                <Text
                    mt={1}
                    color='gray.2'
                >
                    Escolha até 3 imagens para mostrar o quanto o seu produto é incrível!
                </Text>

                <HStack
                    mt={4}
                >
                    {
                        productImages.length > 0 &&
                        productImages.map((image) => (
                            <Box
                                mr={4}
                                width={PHOTO_SIZE}
                                height={PHOTO_SIZE}
                                rounded='lg'
                                bg='gray.5'
                                alignItems='center'
                                justifyContent='center'
                                key={image.uri}
                            >
                                {
                                    isLoading ?
                                        <Loading /> :
                                        <Image
                                            source={{ uri: image.uri }}
                                            alt="imagem do produto"
                                            w={PHOTO_SIZE}
                                            h={PHOTO_SIZE}
                                            rounded="lg"
                                        />
                                }

                                <TouchableOpacity
                                    style={{ position: 'absolute', right: 1, top: 1 }}
                                    onPress={() => handleImageRemove(image)}
                                >
                                    <Icon
                                        as={AntDesign}
                                        name="close"
                                        size={5}
                                        color='gray.7'
                                        bg='gray.1'
                                        rounded='full'
                                        mr={1}
                                        mt={1}
                                    />
                                </TouchableOpacity>
                            </Box>
                        ))
                    }

                    {
                        productImages.length < 3 &&
                        <Box
                            mr={4}
                            width={100}
                            height={100}
                            rounded='lg'
                            bg='gray.5'
                            alignItems='center'
                            justifyContent='center'
                        >
                            <TouchableOpacity
                                onPress={handleUserPhotoSelect}
                            >
                                <Icon
                                    as={AntDesign}
                                    name="plus"
                                    size={7}
                                    color='gray.4'
                                />
                            </TouchableOpacity>
                        </Box>
                    }
                </HStack>

                <Text
                    fontFamily='heading'
                    fontSize='md'
                    color='gray.2'
                    mt={5}
                >
                    Sobre o Produto
                </Text>

                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            placeholder="Título do anúncio"
                            keyboardType="email-address"
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.name?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            placeholder="Descrição do Produto"
                            numberOfLines={5}
                            multiline
                            textAlignVertical="top"
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.description?.message}
                        />
                    )}
                />

                <Radio.Group
                    name="isNew"
                    value={isNew}
                    colorScheme={"gray"}
                    onChange={(item) => {
                        setIsnew(item)
                    }}
                >
                    <HStack>
                        <Radio value="new">Produto Novo</Radio>
                        <Radio value="used" ml={6}>Produto Usado</Radio>
                    </HStack>
                </Radio.Group>

                <Text
                    fontFamily='heading'
                    fontSize='md'
                    color='gray.2'
                    my={4}
                >
                    Venda
                </Text>

                <Controller
                    control={control}
                    name="price"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            placeholder="R$ 45,00"
                            keyboardType="decimal-pad"
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.price?.message}
                        />
                    )}
                />

                <Text
                    fontFamily='heading'
                    fontSize='sm'
                    color='gray.2'
                >
                    Aceita troca?
                </Text>

                <Switch
                    onToggle={(value) => setAcceptTrade(value)}
                    value={acceptTrade}
                    size='lg'
                    alignSelf='baseline'
                    colorScheme='gray'
                />

                <Text
                    fontFamily='heading'
                    fontSize='sm'
                    color='gray.2'
                    mb={3}
                >
                    Meios de Pagamento aceitos
                </Text>

                <Checkbox.Group onChange={setPaymentMethods} value={paymentMethods} accessibilityLabel="Método de pagamentos">
                    <Checkbox colorScheme='blue' value="boleto" defaultIsChecked><Text color='gray.3' fontSize={16}>Boleto</Text></Checkbox>
                    <Checkbox colorScheme='blue' value="pix"><Text color='gray.3' fontSize={16}>Pix</Text></Checkbox>
                    <Checkbox colorScheme='blue' value="cash"><Text color='gray.3' fontSize={16}>Dinheiro</Text></Checkbox>
                    <Checkbox colorScheme='blue' value="card"><Text color='gray.3' fontSize={16}>Cartão de Crédito</Text></Checkbox>
                    <Checkbox colorScheme='blue' value="deposit"><Text color='gray.3' fontSize={16}>Depósito Bancário</Text></Checkbox>
                </Checkbox.Group>


            </ScrollView>
            <HStack
                px={6}
                py={5}
                bg='white'
                w='full'
                mt={10}
            >
                <Button
                    title="Cancelar"
                    variant='gray5'
                    flex={1}
                    mr={2}
                    onPress={handleGoBack}
                />

                <Button
                    title="Avançar"
                    variant='gray1'
                    flex={1}
                    isLoading={isLoading}
                    onPress={handleSubmit(handleCreateProductPreview)}
                />
            </HStack>
        </>
    )
}