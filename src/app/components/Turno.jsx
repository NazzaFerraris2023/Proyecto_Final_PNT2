import React, { useEffect, useState } from 'react';
import { View, Text ,StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function Turno() {
  const {user} =  useAuth();

  //estado turno
  //array de turnos
  const [turno, setTurno] = useState({
    fechaTurno: 0,
    especialidad: "",
    nombreMascota: "",
    name: "",
  })
  
  //estado de array turnos
  const [turnos, setTurnos] = useState([])

  useEffect(() => {
    const fetchTurnos = async() => {
      try{
        const response = await fetch ("https://6856aaae1789e182b37eb8a7.mockapi.io/turno")
        const data = await response.json()
        
        setTurnos(data)
      }
      catch (error) {
        alert("salio un error " + error)
      }
    }

    fetchTurnos()
   
  } ,[])

  //conseguir date mas chico, 
  const proximoTurno = () => {

    //
    const turnosUsuario = turnos.filter((turno) => turno.name == user?.name);

    if (turnosUsuario.length === 0) {
      return null;
    }

    const fechaCercana = turnosUsuario.reduce((previous, current) => {
      return current.fechaTurno < previous.fechaTurno ? current : previous
    });
    return fechaCercana
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
          Próximo turno: {new Date(Number(turnoProximo.fechaTurno)).toLocaleDateString()} - {turnoProximo.especialidad} - {turnoProximo.nombreMascota}
        </Text>
      ) : user && !turnoProximo ? (
        <Text style = {styles.noTurno}>No tenés turnos asignados.</Text>
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
  noTurno: {
    fontSize: 18,
    color: '#b71c1c',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});