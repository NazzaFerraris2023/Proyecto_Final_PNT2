
import React from 'react'
import { createContext, useContext, useEffect, useState } from "react";


const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({children}) {
    const [user,setUser] = useState(null)
  //  const [isAuth,setAuth] = useState(null)
    const [status,setStatus] = useState("checking")

    const login = async (usuario,pass) => {
      try {
        const res = await fetch("https://684372c771eb5d1be030d94d.mockapi.io/users")
        const data = await res.json()
        const persona = data.find(element => element.name === usuario && element.password === pass)
      //  console.log(persona)
        if(persona) {
          setUser(persona)
          setStatus("authenticated")
          ///console.log(status)
          // console.log(status)
          
         // RedirectToAction("home")

        }else{
           setStatus("unauthenticated")
           alert("Usuario o contraseñas incorrectos")
          //  console.log(status)

           //throw "No se pudo autenticar"
        }

       
        


      } catch (error) {
        alert("Hubo un error de conexion")
        console.log(error)
      }

  

    }

   

    const register = async (nombre,pssw,email,telefono) =>{
      try {
        console.log(nombre)
      const response = await fetch("https://684372c771eb5d1be030d94d.mockapi.io/users")
      const data = await response.json()

      const existeUsuario = data.some(usuario => usuario.name === nombre)
      console.log(existeUsuario)
      const existeMail = data.some(usuario => usuario.mail === email)
       const existeTelefono = data.some(usuario => usuario.number === telefono)
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
        })
        const respuesta = await fetch("https://684372c771eb5d1be030d94d.mockapi.io/users",{
          method: "POST",
          headers:{
            'Content-Type':'application/json',
          }
          ,body : body
      
        })

            console.log(respuesta)
      

      if(respuesta.ok){
        alert("Registro exitoso")
      }else{
        alert("Error al registrar el usuario")
      }
      }
 } catch (error) {
       //console.error(error)
        alert('Error en la autenticacion')
      }

    }


  // useEffect(() => {
    
  // }, [])

  return (
    <AuthContext.Provider value={{register,login}}>
      {children}
    </AuthContext.Provider>
  )
}
