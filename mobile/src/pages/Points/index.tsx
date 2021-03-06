import React, { useState, useEffect } from 'react'
import Constants from 'expo-constants'
import { useNavigation, useRoute } from '@react-navigation/native' // useRoute serve para pegar os parâmetros vindos na rota
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Image, Alert } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import api from '../../services/api'
import * as Location from 'expo-location' // todas as funções disponível na variável location


interface Item {
  id: number
  title: string
  image_url: string
  // nota?
}

interface Point {
  id: number
  name: string
  image: string
  image_url: string
  latitude: number
  longitude: number
 }

 interface Params {
  uf: string
  city: string
 }
 
const Points = () => {

  const navigation = useNavigation() // instancia da função

  // variáveis states e setStates respeitando conceito de estado e imutabilidade
  const [items, setItems] = useState<Item[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
  const [points, setPoints] = useState<Point[]>([])

  const route = useRoute()
  const routeParams = route.params as Params

  // chamada axios retornando lista de itens do backend, chamando uma única vez
  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data)
    })
  }, [])

 // chamada para carregar permissão e localização do usuário  
  useEffect(()=>{
    async function loadPosition() {
        const { status } = await Location.requestPermissionsAsync() // variável que registra true ou false para permissão do usuário de localização

        if(status !== 'granted') {
            Alert.alert('Ooops..', 'Precisamos de sua permissão para obter a localização')
            return // saia da função
        }

        const location = await Location.getCurrentPositionAsync() // captura localização do usuário

        const { latitude, longitude } = location.coords

        setInitialPosition([latitude, longitude])
    }  

    loadPosition()
  },[])

  // chamada axios de points filtrados passando parâmetros na requisição
  useEffect(()=>{
    api.get('points', {
      params: {
        city: routeParams.city,
        uf: routeParams.uf,
        items: selectedItems     
      }
    }).then(response => {
      setPoints(response.data)
    })
  },[selectedItems]) // executa toda vez que essa variável mudar

  // função que navega para tela anterior
  function handleNavigateBack() {
    navigation.goBack() // retorna a tela anterior
  }

  // função que navega para tela detail
  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', { point_id: id }) // passando informações para página Detail
  }

  function handleSelectItem(id: number) {

    const alreadySelected = selectedItems.findIndex(item => item === id) // findindex procura na lista, se valor já existe, se existir, retorna a posição do valor

    if(alreadySelected >= 0) {
        const filteredItems = selectedItems.filter(item => item !== id)  //remove, filtrando por id de entrada da função
        
        setSelectedItems(filteredItems)
        
    } else {
        setSelectedItems([ ...selectedItems, id ]) // adiciona
    }
    
}

  return (

    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>
        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>Encontre no mapa o ponto de coleta.</Text>
        <View style={styles.mapContainer}>
          { initialPosition[0] !== 0 && ( // condição ternária (react) para renderização do mapa
             <MapView style={styles.map} loadingEnabled={initialPosition[0] === 0} initialRegion={{ latitude: initialPosition[0], longitude: initialPosition[1], latitudeDelta: 0.014, longitudeDelta: 0.014 }}>
            
            {points.map(point => (
               <Marker key={String(point.id)} style={styles.mapMarker} onPress={() => handleNavigateToDetail(point.id)} coordinate={{ latitude: point.latitude, longitude: point.longitude }}>
               <View style={styles.mapMarkerContainer}>
                 <Image style={styles.mapMarkerImage} source={{ uri: point.image_url }} />
                 <Text style={styles.mapMarkerTitle}>{point.name}</Text>
               </View>
             </Marker>
            ))}

           </MapView>
          )} 
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>

          {items.map(item => (

            <TouchableOpacity key={String(item.id)} style={[styles.item, selectedItems.includes(item.id) ? styles.selectedItem : {} ]} onPress={() => handleSelectItem(item.id)} activeOpacity={0.6} >
              <SvgUri width={42} height={42} uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>

          ))}

        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points