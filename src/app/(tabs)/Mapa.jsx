  import React, { useEffect, useRef, useState } from 'react'
  import { ActivityIndicator, Animated, Easing, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
  import MapView, { Marker, Polyline } from 'react-native-maps'
  import * as Location from 'expo-location';



  const veterinarias = [
    {
      id:'1',
      title: 'Veterinaria',
      description: 'Vete belgrano',
      coordenadas: {latitude: -38.5859, longitude: -38.4186}
    },
    {
      id:'2',
      title: 'Veterinaria 2',
      description: '9 a 14:30 hs',
      coordenadas :{latitude: -34.668574, longitude:-58.496986}
    }

                              
// -58	388311,-34	626081;MOVIL;2018-08-10;8:15 a 14:30 hs ;Pavon y Virrey Cevallos;Plaza Garay;Constitución;1;Atenciones clínicas y turnos de castración
// -58	406886;-34	625913;MOVIL;2018-08-10;8:15 a 14:30 hs ;La Rioja y Cochabamba  ;Plaza Martin Fierro;San Cristobal;3;Atenciones clínicas y turnos de castración
// -58	474991;-34	645153;MOVIL;2018-08-10;8:15 a 14:30 hs ;Fco. Bilbao y Lacarra  ;Parque Avellaneda;Parque Avellaneda;9;Atenciones clínicas y turnos de castración
// -58	492992;-34	605509;MOVIL;2018-08-11;10:30 a 17:30 hs;Cuenca 2500;Plaza Aristobulo del Valle;Villa del Parque;11;Atenciones clínicas y turnos de castración                                                         
// -58	419934;-34	592039;MOVIL;2018-08-11;10:30 a 17:30 hs;Costa Rica 3500 ;Plaza Unidad Latinoamericana ;Palermo;14;Atenciones clínicas y turnos de castración                                                         
// -58	492992;-34	605509;MOVIL;2018-08-12;10:30 a 17:30 hs;Cuenca 2500;Plaza Aristobulo del Valle ;Villa del Parque;11;Atenciones clínicas y turnos de castración                                                         
// -58	419934;-34	592039;MOVIL;2018-08-12;10:30 a 17:30 hs;Costa Rica 3500;Plaza Unidad Latinoamericana ;Palermo;14;Atenciones clínicas y turnos de castración                                                         
// -58	397291;-34	588025;MOVIL;2018-08-17;8:15 a 14:30 hs;Av. Las Heras y Av. Pueyrredon    ;Plaza Tte. Gral. Emilio Mitre;Recoleta;2;Atenciones clínicas y turnos de castración
// -58	456678;-34	621817;MOVIL;2018-08-17;8:15 a 14:30 hs;Av. Avellaneda y Donato Alvarez;Plaza Angel Gris;Flores;7;Atenciones clínicas y turnos de castración
// -58	479826;-34	550748;MOVIL;2018-08-17;8:15 a 14:30 hs;García del Río y Melian;Parque Saavedra;Saavedra;12;Atenciones clínicas y turnos de castración
// -58	475098;-34	688271;MOVIL;2018-08-18;10:30 a 17:30 hs ;Av. Fernandez de la Cruz y Guamaní               ;Plaza Sudamericana ;Villa Riachuelo;8;Atenciones clínicas y turnos de castración                                                         
// -58	445468;-34	604649;MOVIL;2018-08-18;10:30 a 17:30 hs ;Olaya y Antesana;Plaza Benito Nazar ;Villa Crespo;15;Atenciones clínicas y turnos de castración                                                         
// -58	475098;-34	688271;MOVIL;2018-08-19;10:30 a 17:30 hs ;Av. Fernandez de la Cruz y Guamaní;Plaza Sudamericana ;Villa Riachuelo;8;Atenciones clínicas y turnos de castración                                                         
// -58	445468;-34	604649;MOVIL;2018-08-19;10:30 a 17:30 hs ;Olaya y Antesana;Plaza Benito Nazar;Villa Crespo;15;Atenciones clínicas y turnos de castración                                                         
// -58	369577;-34	626455;MOVIL;2018-08-20;10:30 a 17:30 hs ;Defensa y Brasil;Parque Lezama;San Telmo;1;Atenciones clínicas y desparasitaciones 
// -58	407732;-34	625827;MOVIL;2018-08-20;10:30 a 17:30 hs ;La Rioja y Cochabamba;Plaza Martin Fierro;San Cristobal;3;Atenciones clínicas y desparasitaciones 
// -58	506506;-34	6554;MOVIL;2018-08-20;10:30 a 17:30 hs ;Av. Juan B. Alberti y Cafayate;Plaza Salaberry;Mataderos;9;Atenciones clínicas y desparasitaciones 
// -58	487768;-34	559583;MOVIL;2018-08-20;10:30 a 17:30 hs ;Crisólogo Larralde e/ Machain y Mariano Acha;Plaza Alberdi;Saavedra;12;Atenciones clínicas y desparasitaciones 










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
        fetchRoute();
       },[])

     const fetchRoute = async () => {
        console.log('paso 1', location)
        if(!location) return;
         console.log('paso 2', location)
        setLoadingRoute(true)
        setVets([]);
    

        const originStr = `${location.latitude},${location.longitude}`

        const url = `https://api.geoapify.com/v2/geocode/reverse?lat=${location.latitude}&lon=${location.longitude}&apiKey=${GEO_API_KEY} `;
       
        try {
            const resp = await fetch(url, "GET")
            const data = await resp.json();
            setVets(data.features)
            // console.log('data', data)
            // if(data.routes && data.routes.length){
            //    const points =  decodePolyline(data.routes[0].overview_polyline.points)
            //    setRouteCoords(points)
            // }
            
        } catch (error) {
            setErrorMsg('Fallo en generar la ruta')
        }
        setLoadingRoute(false)
        setSelectedRoute(false)
        setModalVisible(false)
    }



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
      ))
    }
          {
              vets && (
              <Polyline
              coordinates= {vets}
              strokeColor= '#0077AFF'
              stokeWidht={5}
              />
            )
          }
          
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