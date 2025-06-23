import React from 'react'
import { Text,View } from 'react-native'
import Turnos from '../components/Turnos';
import ProximoTurno from '../components/ProximoTurno';

export default function Home() {
  return (
    <View>
      <Text>
        estoy en el home
      </Text>
            <ProximoTurno/> 
            <Turnos/> 

    </View>
  )
}
