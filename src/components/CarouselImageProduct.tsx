import { useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { Box, Image } from 'native-base';

import Carousel from 'react-native-reanimated-carousel';

import { api } from '@services/api';

import { ProductDTO } from 'src/dtos/ProductDTO';

type Props = {
    productId: string
}

export function CarouselImageProduct({ productId }: Props) {
    const [product, setProduct] = useState<ProductDTO>({} as ProductDTO);

    async function fetchProduct() {
        try {
            const response = await api.get(`/products/${productId}`)
            setProduct(response.data);

        } catch (error) {
            throw (error)
        }
    }

    useEffect(() => {
        fetchProduct()
    }, [productId])

    const width = Dimensions.get('window').width;
    return (
        <View style={{ flex: 1 }}>
            <Carousel
                loop
                width={width}
                height={260}
                autoPlay={true}
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
        </View>
    );
}
