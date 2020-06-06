import React from 'react';
import { StatusBar } from 'react-native' // parte superior da tela do celular
import { AppLoading } from 'expo' // para monitorar carregamento do app
import Routes from './src/routes' // importando rotas

//exportando fontes
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto'
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu' // useFonts é uma função para utilização das fontes, posso importar essa função dentro de qualquer uma das importação das fontes



// Difere do React em tag htmls e css. Por padrão todos os elementos já tem display flex. não tem herança de estilos, nem cascatas de estilos
export default function App() {

  // monitorar o carregamento das fontes
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  })

  // enquanto as fontes não carregam
  if(!fontsLoaded) {return <AppLoading />}

  
  return (
    // conceito de fragment, uma tag vazia sem valor envolvendo os nós
    <> 
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Routes />
    </>
  )
}