import React from 'react'
import { Button, Text, View } from 'react-native'
import {Link} from "expo-router"
// Cuando el usuario abre la app, si no tiene la sesión iniciada, verá una View con un mensaje de bienvenida, una opción de SignUp (crear una cuenta) y otra de Login (iniciar sesión en una cuenta existente). 

const index = () => {
  return (
    <View>
      <Text>Bienvenido a la plataforma</Text>
      <Link href={"/(tabs)"} asChild>
        <Button title="soy un boton">
        

        </Button>
      
      </Link>
    </View>
  )
}

export default index
