import React from 'react'
import { Text,View } from 'react-native'
import Turnos from '../components/Turnos';
import ProximoTurno from '../components/ProximoTurno';

export default function Home() {
  return (
    <View>

            <ProximoTurno/> 
            <Turnos/> 

    </View>
  )
}
