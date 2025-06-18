  import React, { useEffect, useRef, useState } from 'react'
  import { ActivityIndicator, Animated, Easing, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
  import MapView, { Marker, Polyline } from 'react-native-maps'
  import * as Location from 'expo-location';
  import { useSedes } from '../context/sedeContext';


  const veterinarias = [
    {
      id
    }
  ]




  export default function Mapa() {
  const [location, setLocation] = useState(null)
  const [loadingRoute, setLoadingRout] = useState(null)
  const [selectedRoute, setSelectedRoute] =useState(null)
  const [routeCoords, setRouteCoords] = useState(null)
  const [mapRegion, setMapRegion] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)



  const mapRef = useRef(null)

  useEffect(() => {
    const cargarLocation  = async () => {
      let {status} = await Location.requestForegroundPermissionsAsync()

      if(status != 'granted'){
        setErrorMsg('NO se permite la ubicacion')
        return;
      }
      let locacion = await Location.getCurrentPositionAsync()
      setLocation(locacion.coords)
      setMapRegion({
        latitude : locacion.coords.latitude,
        longitude : locacion.coords.longitude,
        latitudeDelta : 0.05,
        longitudeDelta : 0.05,
      })
    }
    cargarLocation()

  },[])

    return (
      <View style = {styles.container}>
        <MapView mapType='standard' style={styles.map} 
        ref={map.ref} initialRegion={{
          latitude: location.latitude,
          longitude : location.longitude,
          latitudeDelta : 0.05,
          longitudeDelta : 0.05
        }}
        showsUserLocation
        showsCompass              
        onRegionChangeComplete={setMapRegion}
          >
            {
          veterinarias.map((veterinaria) => (
                <Marker
            key={veterinaria.id}
            coordinate={veterinaria.coordenadas}
            onPress = {() => {}}
            image={'../../assets/fotoVeterinaria'}

                    />
                  ))
            }
            </MapView>
      </View>
    )
  }





  const styles = StyleSheet.create({
    container:{
      flex:1,
    },
    map: {
      width :'%100',
      height : '%100', 
    },

  });
