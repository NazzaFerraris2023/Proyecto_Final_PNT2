  import React, { useEffect, useRef, useState } from 'react'
  import { ActivityIndicator, Animated, Easing, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
  import MapView, { Marker, Polyline } from 'react-native-maps'
  import * as Location from 'expo-location';



  


const GEO_API_KEY = '490f91cd29304c21bc363c0e5896385e';

  export default function Mapa() {
  const [location, setLocation] = useState(null)
  const [loadingRoute, setLoadingRoute] = useState(null)
  const [selectedRoute, setSelectedRoute] =useState(null)
  const [vets, setVets] = useState([])
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
          duration: 230,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
            }).start()
        }
    },[modalVisible])

   const alingNorth = () => {
    if(mapRef.current && mapRegion){
      mapRef.current.animateCamera({
        heading: 0,
        pitch: 0,
        center:{
          latitude: mapRegion.latitude,
          longitude: mapRegion.longitude,
        }
      })
    }
   }



    const centrarUser = () => {
      if(mapRef.current && location){
        mapRef.current.animateToRegion({
        latitude : location.latitude,
        longitude : location.longitude,
        latitudeDelta : 0.05,
        longitudeDelta : 0.05,
        })
      }
    }
       useEffect(() => {
         const cargarVeterinarias = async () => {
    
      
      const url =  `https://api.geoapify.com/v2/places?categories=pet.veterinary&filter=circle:${location.longitude},${location.latitude},5000&bias=proximity:${location.longitude},${location.latitude}&limit=20&apiKey=${GEO_API_KEY}`;
     
      let resp = await fetch(url)
      let json = await resp.json()
   
      setVets(json.features)
    }
    
    cargarVeterinarias()

  }, []);



    const abrirVeterinaria = (veterinaria) =>{
      setSelectedRoute(veterinaria)
      setModalVisible(true)

    }
    const handleClose = () =>{
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
        }).start(() => {
          setModalVisible(false)
          setSelectedRoute(null)
          setVets(null)
        })
    }



    return (
      <View style = {styles.container}>
        {location && (
          <MapView mapType='standard'
           showsMyLocationButton={false} 
           style={styles.map} 
            ref={mapRef} initialRegion={{
              latitude: location.latitude,
              longitude : location.longitude,
              latitudeDelta : 0.05,
              longitudeDelta : 0.05
            }}
          
          disabled={loadingRoute}
          showsUserLocation
          showsCompass              
          onRegionChangeComplete={setMapRegion}
          >

      {vets.map((v, i) => (
        <Marker
          key={i}
          coordinate={{
            latitude: v.properties.lat,
            longitude: v.properties.lon
          }}
          title={v.properties.name}
          description={v.properties.formatted}
        />
   )) }
         
        </MapView>

        )}

        <Pressable style={styles.centerButton} onPress={centrarUser}>
        <Image source={require('../../../assets/a.png')}
         style={{width: 32, height: 32}}
        resizeMode='contain'/>
        </Pressable> 
         
        <Pressable style={styles.alignButton} onPress={alingNorth}>
        <Image source={require('../../../assets/descargar.png')}
         style={{width: 32, height: 32}}
        resizeMode='contain'/>
        </Pressable>
        


        <Modal  visible= {modalVisible}
        animationType='fade'
        transparent
        onRequestClose={() => setSelectedSede(null)}> 
        <Animated.View style={[styles.modalOverlay, {opacity: fadeAnim}]}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Image
            source={require('../../../assets/veterinaria.png')}
            style={styles.modalIcon}
            />
            <View>
              <Text style={styles.modalTitle}>{selectedRoute?.title}</Text>
              <Text style={styles.modalSubtitle}>{selectedRoute?.description}</Text>
            </View>
          </View>

          <View style={{marginVertical:10}}>
            <Pressable 
          style={styles.modalButton}
          onPress={() => fetchRoute(selectedRoute.coordenadas)}
          disabled={loadingRoute}
      >
          {loadingRoute ? (
              <ActivityIndicator color={"#fff"} />
          ): (
                  <Text style={styles.modalButtonText}>Ver Ruta</Text>
              )
          }
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