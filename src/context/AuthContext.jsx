import { useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
const router = useRouter();

export default function AuthProvider({children}) {
    const [user,setUser] = useState(null);

    useEffect(() => {
        async function checkIfUser(){
          const usuarioGuardado = await AsyncStorage.getItem("user");
          console.log(usuarioGuardado);
          
          if(usuarioGuardado) {
            setUser(JSON.parse(usuarioGuardado));
            router.replace('home');
          }
        }
        checkIfUser()
    }, []);

    useEffect(() => {
      if(user != null) {
        router.replace('home');
      }
    }, [user]);


    const login = async (usuario,pass) => {
      try {
        const res = await fetch("https://684372c771eb5d1be030d94d.mockapi.io/users")
        const data = await res.json()
        const persona = data.find(element => element.name === usuario && element.password === pass);

        if(persona) {
          await AsyncStorage.setItem("user", JSON.stringify(persona));
          setUser(persona);
        }else{
           alert("Usuario o contraseñas incorrectos");
        }

      } catch (error) {
        alert("Hubo un error de conexion")
        console.log(error)
      }
    }

    const register = async (nombre,pssw,email,telefono) =>{
      try {
        const response = await fetch("https://684372c771eb5d1be030d94d.mockapi.io/users");
        const data = await response.json();
        const existeUsuario = data.some(usuario => usuario.name === nombre);
        const existeMail = data.some(usuario => usuario.mail === email);
        const existeTelefono = data.some(usuario => usuario.number === telefono);
        
        if(existeUsuario){
          alert("Usuario ya registrado")
        
        }else if(existeMail){
          alert("Mail ya existente")
        
        }else if(existeTelefono){
          alert("Telefono ya existente")
        
        } else{
            const body = JSON.stringify({
              name : nombre, 
              mail : email,
              password : pssw,
              number : telefono, //corregir number xq no tira numeros de telefono 
            });
            const respuesta = await fetch("https://684372c771eb5d1be030d94d.mockapi.io/users",{
              method: "POST",
              headers:{
                'Content-Type':'application/json',
              },
              body: body
            });

             setUser(JSON.parse(body));
        }

      } catch (error) {
        alert('Error en la autenticacion')
        console.log(error)
      }
    }

    return (
      <AuthContext.Provider value={{register,login, user}}>
        {children}
      </AuthContext.Provider>
    )
}
