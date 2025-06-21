import React, { useEffect } from "react";
//import { useRouter } from 'expo-router';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../context/AuthContext";
// Cuando el usuario abre la app, si no tiene la sesión iniciada, verá una View con un mensaje de bienvenida, una opción de SignUp (crear una cuenta) y otra de Login (iniciar sesión en una cuenta existente).

const index = () => {
  const {checkIfUser} = useAuth();
//
  useEffect(() => {
    checkIfUser();
  }, [])

  return (
      <View style={styles.container}>
        <Text>Bienvenido a la plataforma</Text>
        <Link href={"/RegisterLogin"} asChild>
        </Link>
        <Button title="soy un boton"></Button>
      </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    padding:20
  } 
});

export default index;
