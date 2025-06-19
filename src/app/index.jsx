import React, { useEffect } from "react";
import { useRouter } from 'expo-router';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../context/AuthContext";
// Cuando el usuario abre la app, si no tiene la sesión iniciada, verá una View con un mensaje de bienvenida, una opción de SignUp (crear una cuenta) y otra de Login (iniciar sesión en una cuenta existente).

const index = () => {
  const {user} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if(user) router.replace('home');
  }, [user])

  return (
      
      <View style={styles.container}>
        {user == null && (
          <>
          <Text>Bienvenido a la plataforma</Text>
          <Link href={"/RegisterLogin"} asChild>
            <Button title="soy un boton"></Button>
          </Link>
          </>
        )}
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
