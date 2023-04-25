import { useEffect, useState } from "react";
import { Box, HStack, Icon, Text, VStack, useToast, Image, Checkbox, Radio, ScrollView, Switch } from "native-base";
import { TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons'

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import ProductImage from '@assets/ImagemPadraoCompra.png'

import { useNavigation } from "@react-navigation/native";
import { Loading } from "@components/Loading";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

type PhotoProps = {
    uri: string;
    name: string;
    type: string;
}

export function CreateProduct() {
    const [isLoading, setIsLoading] = useState(false);
    const [productImages, setProductImages] = useState<PhotoProps[]>([]);
    const [paymentMethod, setPaymentMethod] = useState();
    const [isNew, setIsnew] = useState("new");
    const [acceptTrade, setAcceptTrade] = useState(false);

    const navigation = useNavigation();
    const toast = useToast();

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
                    aspect: [16, 9],
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
                                width={100}
                                height={100}
                                rounded='lg'
                                bg='gray.5'
                                alignItems='center'
                                justifyContent='center'
                                key={image.uri}
                            >
                                <Image
                                    source={{ uri: image.uri }}
                                    alt="imagem do produto"
                                    w={100}
                                    h={100}
                                    rounded="lg"

                                />

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

                <Input
                    placeholder="Título do anúncio"
                />

                <Input
                    placeholder="Descrição do Produto"
                    numberOfLines={5}
                    multiline
                    textAlignVertical="top"
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

                <Input
                    placeholder="R$ 45,00"
                    keyboardType="decimal-pad"
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

                <Checkbox.Group onChange={setPaymentMethod} value={paymentMethod} accessibilityLabel="Método de pagamentos">
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
                />

                <Button
                    title="Avançar"
                    variant='gray1'
                    flex={1}
                />
            </HStack>
        </>
    )
}