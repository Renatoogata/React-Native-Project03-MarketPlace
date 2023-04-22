import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Checkbox, FlatList, HStack, Icon, Switch, Text, useTheme, useToast, VStack } from "native-base";
import { MaterialCommunityIcons, SimpleLineIcons, Entypo } from '@expo/vector-icons'
import { Controller, useForm } from "react-hook-form";

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import BottomSheet from '@gorhom/bottom-sheet';

import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";

import Avatar from '@assets/avatar.png'
import MyProductsIcon from '@assets/IconMyProducts.svg'

import { AppError } from "@utils/AppError";

import { UserPhoto } from "@components/UserPhoto";
import { Button } from "@components/Button";
import { TouchableOpacity } from "react-native";
import { Input } from "@components/Input";
import { ProductCard } from "@components/ProductCard";
import { ProductType } from "@components/ProductType";
import { ProductDTO } from "src/dtos/ProductDTO";
import { Loading } from "@components/Loading";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";


type FormDataProps = {
    name?: string;
}

const searchSchema = yup.object({
    name: yup.string()
})

export function Home() {
    const { colors } = useTheme();
    const { user } = useAuth();
    const toast = useToast();
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    const [isLoading, setIsLoading] = useState(false);

    const [activeProducts, setActiveProducts] = useState<ProductDTO[]>([]);
    const [products, setProducts] = useState<ProductDTO[]>([]);
    const [isNew, setIsNew] = useState<boolean>();
    const [acceptTrade, setAcceptTrade] = useState<boolean>();
    const [paymentMethods, setPaymentMethods] = useState<string[]>(['pix', 'boleto', 'cash', 'deposit', 'card'])

    const { control, handleSubmit } = useForm<FormDataProps>({
        resolver: yupResolver(searchSchema)
    })


    const bottomSheetRef = useRef<BottomSheet>(null);
    const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
    const snapPoints = useMemo(() => ["65%", "80%",], []);

    function handleOpenMyProducts() {
        navigation.navigate('myproducts')
    }

    function handleOpenProductDetail(productId: string) {
        navigation.navigate('product', { productId })
    }

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    async function handleSearchProduct() {
        const productsData = await api.get(`/products/`);
    }

    function handleResetFilter() {
        try {
            setIsLoading(true)
            setIsNew(true);
            setAcceptTrade(false);
            setPaymentMethods(['pix', 'boleto', 'cash', 'deposit', 'card']);
            fetchProduts();
        } catch (error) {
            throw (error)
        } finally {
            setBottomSheetOpen(false)
            setIsLoading(false)
        }

    }

    async function handleSearchWithFilters(data?: FormDataProps) {
        try {
            setIsLoading(true)
            let paymentMethodsQuery = "";

            paymentMethods.forEach((item) => {
                paymentMethodsQuery = paymentMethodsQuery + `&payment_methods=${item}`;
            });

            if (data) {
                const response = await api.get(`/products/?is_new=${isNew}&accept_trade=${acceptTrade}${paymentMethodsQuery}&query=${data.name}`)
                setProducts(response.data);
            } else {
                const response = await api.get(`/products/?is_new=${isNew}&accept_trade=${acceptTrade}${paymentMethodsQuery}`)
                setProducts(response.data);
            }

        } catch (error) {
            throw error;
        } finally {
            setBottomSheetOpen(false)
            setIsLoading(false)
        }
    }

    async function fetchProduts() {
        try {
            setIsLoading(true);
            const response = await api.get('/products')
            setProducts(response.data);

            const myProducts = await api.get('/users/products')
            setActiveProducts(myProducts.data);

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Não foi possível carregar os produtos"
            toast.show({
                title,
                placement: 'top',
                bg: 'red.light'
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProduts();
    }, [])

    return (
        <VStack
            pt={16}
            px={6}
            flex={1}
            bg='gray.6'
        >
            <HStack>
                <UserPhoto
                    source={
                        user.avatar
                            ? { uri: `${api.defaults.baseURL}/images/${user.avatar}` }
                            : Avatar
                    }
                    alt="perfil"
                    size={10}
                    border={2}
                />
                <VStack
                    ml={2}
                    flex={1}
                >
                    <Text
                        numberOfLines={1}
                        flexShrink={1}
                    >
                        Boas vindas,
                    </Text>
                    <Text
                        fontFamily='heading'
                        numberOfLines={1}
                        flexShrink={1}
                    >
                        {user.name}
                    </Text>
                </VStack>
                <Button
                    title="Criar anúncio"
                    width={33}
                    variant='gray1'
                    iconName="plus"
                    onPress={handleSearchProduct}
                />
            </HStack>
            <Text
                mt={10}
                color='gray.3'
            >
                Seus produtos anunciados para venda
            </Text>
            <HStack
                style={{ backgroundColor: 'rgba(100, 122, 199, 0.1)' }}
                mt={3}
                p={3}
                alignItems='center'
                rounded='md'
            >
                <MyProductsIcon
                    fill={colors.blue['regular']}
                    width={24}
                    height={24}
                />
                <VStack
                    flex={1}
                    ml={3}
                    justifyContent='space-around'
                >
                    <Text
                        fontSize='2xl'
                        fontFamily='heading'
                        mb={-1}
                    >
                        {!activeProducts ? <Loading /> : activeProducts.length}
                    </Text>
                    <Text>
                        anúncios ativos
                    </Text>
                </VStack>

                <TouchableOpacity
                    onPress={handleOpenMyProducts}
                >
                    <HStack
                        alignItems='center'
                    >
                        <Text
                            color='blue.regular'
                            fontFamily='heading'
                        >
                            Meus Anúncios
                        </Text>

                        <Icon
                            as={MaterialCommunityIcons}
                            name="arrow-right"
                            color='blue.regular'
                            size={4}
                            ml={2}
                        />
                    </HStack>
                </TouchableOpacity>
            </HStack>
            <Text
                pt={8}
                color='gray.3'
            >
                Compre produtos variados
            </Text>
            <Box
                mt={2}
            >
                <Box
                    flexDirection='row'
                    position='absolute'
                    zIndex={1}
                    right={1}

                >
                    <TouchableOpacity
                        onPress={handleSubmit(handleSearchWithFilters)}
                        style={{ padding: 7 }}
                    >
                        <Icon
                            as={Entypo}
                            name="magnifying-glass"
                            size={7}
                            color='gray.2'
                        />
                    </TouchableOpacity>
                    <Box
                        w={0.2}
                        mx={1.5}
                        bg='gray.3'
                    ></Box>
                    <TouchableOpacity onPress={() => setBottomSheetOpen(true)} style={{ padding: 7 }}>
                        <Icon
                            as={SimpleLineIcons}
                            name='equalizer'
                            size={6}
                            color='gray.2'
                        />
                    </TouchableOpacity>
                </Box>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { value, onChange } }) =>
                        <Input
                            placeholder="Buscar Anúncio"
                            onChangeText={onChange}
                            value={value}
                        />
                    }
                />


            </Box>

            {
                isLoading ? <Loading /> :
                    <FlatList
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        data={products}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <ProductCard
                                source={{ uri: `${api.defaults.baseURL}/images/${item.product_images[0].path}` }}
                                avatar={item.user?.avatar}
                                isNew={item.is_new}
                                name={item.name}
                                price={item.price}
                                onPress={() => handleOpenProductDetail(item.id)}
                            />
                        )}
                        ListEmptyComponent={
                            <Text
                                alignSelf='center'
                                fontFamily='heading'
                                mt={20}
                            >
                                Não tem produtos cadastrados
                            </Text>
                        }
                    />
            }

            {
                bottomSheetOpen ?
                    <BottomSheet
                        style={{ flex: 1 }}
                        index={0}
                        ref={bottomSheetRef}
                        snapPoints={snapPoints}
                        enablePanDownToClose
                        onChange={handleSheetChanges}
                    >
                        <VStack
                            pt={3}
                            px={4}
                        >
                            <HStack
                                justifyContent='space-between'
                                alignItems='center'
                            >
                                <Text
                                    fontFamily='heading'
                                    fontSize='lg'
                                >
                                    Filtrar Anúncios
                                </Text>

                                <TouchableOpacity>
                                    <Icon
                                        as={MaterialCommunityIcons}
                                        name="close"
                                        size={6}
                                        onPress={() => setBottomSheetOpen(false)}
                                    />
                                </TouchableOpacity>
                            </HStack>
                            <Text
                                mt={4}
                                fontFamily='heading'
                            >
                                Condição
                            </Text>
                            <HStack
                                my={2}
                            >
                                <TouchableOpacity onPress={() => setIsNew(true)} style={{ opacity: isNew === true ? 1 : 0.4 }}>
                                    <ProductType
                                        isNew
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setIsNew(false)} style={{ opacity: isNew === false ? 1 : 0.4 }}>
                                    <ProductType
                                        isNew={false}
                                    />
                                </TouchableOpacity>
                            </HStack>

                            <Text
                                mt={2}
                                fontFamily='heading'
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
                                mt={2}
                                fontFamily='heading'
                            >
                                Meios de pagamento aceitos
                            </Text>


                            <Checkbox.Group onChange={setPaymentMethods} value={paymentMethods} accessibilityLabel="Método de pagamentos">
                                <Checkbox colorScheme='blue' value="boleto" defaultIsChecked><Text color='gray.3' fontSize={16}>Boleto</Text></Checkbox>
                                <Checkbox colorScheme='blue' value="pix"><Text color='gray.3' fontSize={16}>Pix</Text></Checkbox>
                                <Checkbox colorScheme='blue' value="cash"><Text color='gray.3' fontSize={16}>Dinheiro</Text></Checkbox>
                                <Checkbox colorScheme='blue' value="card"><Text color='gray.3' fontSize={16}>Cartão de Crédito</Text></Checkbox>
                                <Checkbox colorScheme='blue' value="deposit"><Text color='gray.3' fontSize={16}>Depósito Bancário</Text></Checkbox>
                            </Checkbox.Group>

                            <HStack
                                flex={1}
                                mt={8}
                            >
                                <Button
                                    title="Resetar filtros"
                                    flex={1}
                                    mr={3}
                                    variant="gray5"
                                    onPress={handleResetFilter}
                                />

                                <Button
                                    title="Aplicar filtros"
                                    onPress={() => handleSearchWithFilters()}
                                    flex={1}
                                />
                            </HStack>

                        </VStack>
                    </BottomSheet>
                    : null
            }
        </VStack>
    )
}
