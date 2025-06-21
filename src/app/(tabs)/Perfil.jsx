import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, StyleSheet, Image} from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';


export default function Perfil() {
  //const [sesion, setSesion] = useState(true)
  const [profileImg, setProfileImg] = useState(null);

  useEffect(() => {
    const getProfileImg = async () => {
      const storageImg = await AsyncStorage.getItem("profileImg");

      if(storageImg !== null){
        setProfileImg(storageImg);
      }
    }

    getProfileImg();
  }, []);

  // useEffect(() => {
  //   if(profileImg !== null){
  //     setProfileImg()
  //   }

  // }, [profileImg]);

  const takePic = async () => {
    try{
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos', 'livePhotos'],
        allowsEditing: true,
        quality: 1
      });

      if(result.canceled){
        throw "Cancelado";
      }

      await AsyncStorage.setItem("profileImg", result.assets[0].uri)
      setProfileImg(result.assets[0].uri);
      
    } catch(e){
      console.log(`Error al tomar la imagen: ${e}`); 
    }
  }

  
  return (
    <View>
      
      <TouchableOpacity style={styles.profileBtn} onPress={takePic}>
        {profileImg && 
          <Image 
            source={{uri: profileImg}}
            style={styles.profileImg}
          />
        }
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  profileBtn: {
    width: 170,
    height: 170,
    backgroundColor: "#999",
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 35,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  profileImg: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  }
});