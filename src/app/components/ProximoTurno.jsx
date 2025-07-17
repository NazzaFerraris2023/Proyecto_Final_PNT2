import React, { useEffect, useState, useCallback } from 'react';
import { View, Text ,StyleSheet, } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from 'expo-router';

export default function ProximoTurno() {
  const {user} =  useAuth();

  const [turnos, setTurnos] = useState([]);

  const fetchTurnos = async () => {
    try {
      const response = await fetch("https://6856aaae1789e182b37eb8a7.mockapi.io/turno");
      const data = await response.json();
      setTurnos(data);
    } catch (error) {
      alert("salio un error " + error);
    }
  };



  useFocusEffect(
    React.useCallback(() => {
      fetchTurnos();
    }, [])
  );

  //conseguir date mas cercano a la fecha de hoy, sin ser una fecha pasada.
  const proximoTurno = () => {

    const turnosUsuario = turnos.filter((turno) => turno.name == user?.name);

    const fechaHoy = Date.now();
    const turnosFuturos = turnosUsuario.filter(turno => new Date(turno.fechaTurno) >= fechaHoy)

    if (turnosFuturos.length === 0) {
      return null;
    }

    const fechaCercana = turnosFuturos.reduce((previous, current) => {
      return new Date(current.fechaTurno) < new Date(previous.fechaTurno) ? current : previous;
    });
    return fechaCercana;
  }



  useEffect(() => {
    if (turnos.length > 0 && user) {
      console.log('turno proximo: ', proximoTurno());
    }
  }, [turnos, user]);

  const turnoProximo = proximoTurno();


  return (
    <View style ={styles.container}>
      {user && turnoProximo ? (
        <Text style = {styles.turno}>
          Próximo turno: {new Date(turnoProximo.fechaTurno).toLocaleDateString()} - {turnoProximo.especialidad} - {turnoProximo.nombreMascota}
        </Text>
      ) : user && !turnoProximo ? (
        <Text style = {styles.sinTurno}>No tenés turnos proximos</Text>
      ) : null}
    </View>
  );



}


const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    backgroundColor: '#64b5f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  turno: {
    fontSize: 18,
    color: '#1565c0',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sinTurno: {
    fontSize: 20,
    color: '#b71c1c',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});