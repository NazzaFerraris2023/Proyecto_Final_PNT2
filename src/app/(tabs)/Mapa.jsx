  import React, { useEffect, useRef, useState } from 'react'
  import { ActivityIndicator, Animated, Easing, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
  import MapView, { Marker, Polyline } from 'react-native-maps'
  import * as Location from 'expo-location';



  const veterinarias = [
    {
      id:'1',
      title: 'Veterinaria',
      description: 'Vete belgrano',
      coordenadas: {latitude: -34.5859, longitude: -58.4186}
    }

  ]
function decodePolyline(t, e) {
    let points = [];
    let index = 0, lat = 0, lng = 0;
    while (index < t.length) {
      let b, shift = 0, result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      shift = 0; result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;
      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  }

const GOOGLE_MAPS_APIKEY = 'AIzaSyA5_igLeSHGtZ5Z0vj1Ilib7d7s93C3buU';

  export default function Mapa() {
  const [location, setLocation] = useState(null)
  const [loadingRoute, setLoadingRout] = useState(null)
  const [selectedRoute, setSelectedRoute] =useState(null)
  const [routeCoords, setRouteCoords] = useState(null)
  const [mapRegion, setMapRegion] = useState(null)
  const [modalVisible, setModalVisible] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)



  const mapRef = useRef(null)

  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const cargarLocation  = async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();

      if(status !== 'granted'){
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




    useEffect(() =>{
      if(modalVisible){
        Animated.timing(fadeAnim,{
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease)
        }).start()
      }
    },[modalVisible])

   const alingNorth = () => {
    if(mapRef.current && mapRegion){
      mapRef.current.animateCamera({
        heading:0,
        pitch:0,
        center:{
          latitude: mapRegion.latitude,
          longitude: mapRegion.longitude
        }
      })
    }
   }



    const centrarUser = () => {
      if(mapRef.current && location){
        mapRef.current.animateToRegion({
        latitude : locacion.latitude,
        longitude : locacion.longitude,
        latitudeDelta : 0.05,
        longitudeDelta : 0.05,
        })
      }
    }

    const fetchRoute = async (destino) => {
      if(!location) return;
      setLoadingRout(true);
      setRouteCoords(null);


      const originStr = `${location.latitude},${location.longitude}`
        const destStr = `${destino.latitude},${destino.longitude}`

     const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destStr}&mode=walking&key=${GOOGLE_MAPS_APIKEY}`;
        
        
      try{
        const resp = await fetch(url);
        const data = await resp.json();
        if(data.routes && data.routes.length){
          const point = decodePolyline(data.routes[0].overview_polyline.points)
          setRouteCoords(point)
        }


      }catch(error){
        setErrorMsg('Fallo en el trazado de ruta')
      }
      setLoadingRout(false);
      setSelectedRoute(false)
      setModalVisible(false)

    }


    const abrirVeterinaria = (veterinaria) =>{
      setSelectedRoute(veterinaria)
      setModalVisible(true)

    }
    const handleClose = () =>{
      Animated.timing(fadeAnim,{
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease)
        }).start(() => {
          setModalVisible(false)
          setSelectedRoute(null)
          setRouteCoords(null)
        })
    }



    return (
      <View style = {styles.container}>
        {location && (
          <MapView mapType='standard'
           showsMyLocationButton={false} 
           style={styles.map} 
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
            onPress = {() => abrirVeterinaria(veterinaria)}
            image={require('../../../assets/juanfer.png')}

               />
            ))
          }
          {
              routeCoords && (
              <Polyline
              coordinates= {routeCoords}
              strokeColor= '#0077AFF'
              stokeWidht={5}
              />
            )
          }
          
        </MapView>

        )}

        <Pressable style={styles.centerButton} onPress={centrarUser}>
        <Image source={require('../../../assets/juanfer.png')}/>
        </Pressable> 
         
        <Pressable style={styles.alignButton} onPress={alingNorth}>
        <Image source={require('../../../assets/juanfer.png')}/>
        </Pressable>
        


        <Modal  visible= {modalVisible}
        animationType='fade'
        transparent
        onRequestClose={() => setSelectedRoute(null)}> 
        <Animated.View style={[styles.modalOverlay, {opacity: fadeAnim}]}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Image
            source={require('../../../assets/juanfer.png')}
            style={styles.modalIcon}
            />
            <View>
              <Text style={styles.modalTitle}>{selectedRoute?.title}</Text>
              <Text style={styles.modalSubtitle}>{selectedRoute?.description}</Text>
            </View>
          </View>

          <View style={{marginVertical:10}}>
            <Pressable 
            syle={styles.modalButton}
            onPress={() => fetchRoute(selectedRoute.coordenadas)}
            disabled={loadingRoute}
            >
              {loadingRoute? (
                <ActivityIndicator color={"#fff"}/>
              ):(
                <Text style={styles.modalButtonText}>Ruta</Text>
              )}
            </Pressable>

          </View>
          <Pressable style={styles.closeModal}
          onPress={handleClose}>
            <Text style={styles.closeText}>Cerrar</Text>
          </Pressable>

        </View>
        </Animated.View>
         
        </Modal>
      </View>
    )
  }





  const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    centerButton: {
        position: 'absolute',
        bottom: 40,
        right: 16,
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 24,
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    alignButton: {
        position: 'absolute',
        bottom: 100,
        right: 16,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },
    modalCard: {
        backgroundColor: 'white',
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        padding: 24,
        paddingBottom: 36,
        minHeight: 220,
        elevation: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.13,
        shadowRadius: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    modalIcon: {
        width: 38,
        height: 38,
        marginRight: 16,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: "#222",
    },
    modalSubtitle: {
        fontSize: 16,
        color: "#707070",
        marginTop: 4,
    },
    modalButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 17,
        letterSpacing: 0.2,
    },
    closeModal: {
        alignSelf: 'center',
        marginTop: 12,
        padding: 6,
    },
    closeText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    errorBanner: {
        position: 'absolute',
        top: 48,
        left: 16,
        right: 16,
        backgroundColor: '#EA4343',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        zIndex: 999,
    },
});