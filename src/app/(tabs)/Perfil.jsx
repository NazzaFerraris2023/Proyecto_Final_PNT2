import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, StyleSheet, Image, TextInput} from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from 'expo-router';


export default function Perfil() {
  const [profileImg, setProfileImg] = useState(null);
  const [name, setName] = useState(null);
  const [mail, setMail] = useState(null);
  const [cantMascotas, setCantMascotas] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const {closeSession} = useAuth();

  useEffect(() => {
    initUserInfo();
  }, []);
      
  useFocusEffect(
    React.useCallback(() => {
      getCantidadMascotas();
    }, [])
  );//actualiza la cantidad de mascotas todas las veces que se vuelve al perfil
  const initUserInfo = async () => {
    const userInfo = await getUserInfo();
    setName(userInfo.name);
    setMail(userInfo.mail);
    setProfileImg(userInfo.photo);
    getCantidadMascotas();
  }

  const getUserInfo = async () => {
    const user = await AsyncStorage.getItem('user');
    const userObj = await JSON.parse(user);
    const userData = await fetch(`https://684372c771eb5d1be030d94d.mockapi.io/users/${userObj.id}`);
    const userInfo = await userData.json();
    return userInfo;
  }

  const getCantidadMascotas = async () => {
    const user = await getUserInfo()
    const mascotasJson = await fetch('https://685208d68612b47a2c0be5cb.mockapi.io/Mascotas');
    const mascotasObj = await mascotasJson.json();
    const mascotasDuenio = await mascotasObj.filter((m) => m.duenio === user.name)
    setCantMascotas(mascotasDuenio.length);
  }

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

      const userInfo = await getUserInfo();
      await fetch(`https://684372c771eb5d1be030d94d.mockapi.io/users/${userInfo.id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({photo: result.assets[0].uri})
      });
      setProfileImg(result.assets[0].uri);
      
    } catch(e){
      console.log(`Error al tomar la imagen: ${e}`); 
    }
  }

  const toggleEditMode = async () => {
    if(!editMode) setEditMode(true);
    else setEditMode(false);
  }

  const handleSaveChanges = async () => {
    const userInfo = await getUserInfo();
    try{
      if(name){
        await fetch(`https://684372c771eb5d1be030d94d.mockapi.io/users/${userInfo.id}`, {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json',},
          body: JSON.stringify({name: name})
        });
      }
      if(mail){
        await fetch(`https://684372c771eb5d1be030d94d.mockapi.io/users/${userInfo.id}`, {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json',},
          body: JSON.stringify({mail: mail})
        });
      }

    } catch(e){
      console.log(`Error al actualizar el nombre de usuario: ${e}`);
    }

    toggleEditMode();
  }

  return (
    <View>
      {!editMode && <Text style={styles.name}>{name}</Text>}
      {editMode && 
        <TextInput
          style={styles.input}
          placeholder={name}
          value={name}
          onChangeText={setName}
        />
      }

      <TouchableOpacity style={styles.profileBtn} onPress={takePic}>
        {profileImg && 
          <Image 
            source={{uri: profileImg}}
            style={styles.profileImg}
          />
        }
      </TouchableOpacity>

      <View style={styles.personalInfoCont}>
        {!editMode && <Text style={styles.info}>{mail}</Text>}
        {editMode && 
          <TextInput
            style={styles.input}
            placeholder={mail}
            value={mail}
            onChangeText={setMail}
          />
        }
        <Text style={styles.info}>{cantMascotas} mascotas</Text>
      </View>

      <View style={styles.btnCont}>
      {editMode && 
        <TouchableOpacity style={styles.editBtn} onPress={handleSaveChanges}>
          <Text style={styles.editBtnText}>Guardar cambios</Text>
        </TouchableOpacity>
      }
        <TouchableOpacity style={styles.editBtn} onPress={toggleEditMode}>
          {
            !editMode  ? <Text style={styles.editBtnText}>Editar info</Text>
            : <Text style={styles.editBtnText}>Salir modo edición</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.editBtn} onPress={closeSession}>
          <Text style={styles.editBtnText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  name: {
    marginTop: 30,
    marginLeft: 30,
    fontSize: 30,
    fontWeight: 'bold'
  },
  profileBtn: {
    width: 170,
    height: 170,
    backgroundColor: "#999",
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 30,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  profileImg: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  personalInfoCont: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 50,
    marginTop: 30,
  },
  info: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  btnCont: {
    marginTop: 120,
  },
  editBtn: {
    width: 170,
    height: 45,
    borderRadius: 5,
    backgroundColor: "#3af",
    marginTop: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',  
  },
  editBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF'
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "grey",
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});