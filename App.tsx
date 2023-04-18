import { NativeBaseProvider, StatusBar } from 'native-base';

import { useFonts, Karla_400Regular, Karla_700Bold } from '@expo-google-fonts/karla'

import { THEME } from '@theme/index';
import { Loading } from '@components/Loading';

export default function App() {
  const [fontsLoaded] = useFonts({ Karla_400Regular, Karla_700Bold })

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {fontsLoaded ? <Loading /> : <Loading />}
    </NativeBaseProvider>
  );
}