import { useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { Image } from 'native-base';

import Carousel from 'react-native-reanimated-carousel';

import { api } from '@services/api';

import { ProductDTO } from 'src/dtos/ProductDTO';

import { Loading } from './Loading';

type Props = {
    productId: string
}

export function CarouselImageProduct({ productId }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [number, setNumber] = useState(0);
    const [product, setProduct] = useState<ProductDTO>({} as ProductDTO);

    async function fetchProduct() {
        try {
            setIsLoading(true)
            const response = await api.get(`/products/${productId}`)
            setProduct(response.data);
            setNumber(response.data.product_images.length)
        } catch (error) {
            throw (error)
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchProduct()
    }, [productId])

    const width = Dimensions.get('window').width;
    return (
        <View style={{ flex: 1 }}>

            {
                isLoading ? <Loading /> :
                    <Carousel
                        loop
                        width={width}
                        height={260}
                        autoPlay={number > 1}
                        data={product.product_images}
                        scrollAnimationDuration={2000}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: `${api.defaults.baseURL}/images/${item.path}` }}
                                w='full'
                                h='full'
                                alt="Foto Carrosel"
                                resizeMode='cover'
                            />
                        )}
                    />
            }
        </View>
    );
}
