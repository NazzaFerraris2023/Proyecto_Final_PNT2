import React from "react";
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
// Cuando el usuario abre la app, si no tiene la sesión iniciada, verá una View con un mensaje de bienvenida, una opción de SignUp (crear una cuenta) y otra de Login (iniciar sesión en una cuenta existente).

const index = () => {
  return (

      <View style={styles.container}>
        <Text>Bienvenido a la plataforma</Text>
        <Link href={"/(tabs)"} asChild>
          <Button title="soy un boton"></Button>
        </Link>
      </View>

  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    padding:20
  }
})

export default index;
