import React, { useState } from "react";
import { Button, Switch, Text, TextInput, View } from "react-native";

function Mascotas() {
  const [formulario, setFormulario] = useState(false);
  const [mascota,setMascota] = useState({
    nombre:"",
    raza:"",
    edad:0,
    salud:true //true hace referencia a que esta sano
  })
  const [mascotas,setMascotas] = useState([])

    const agregarMascota = async (nombre,raza,edad,estado) => {
      try {
    const response = await fetch("https://685208d68612b47a2c0be5cb.mockapi.io/Mascotas")
    const data = await response.json()

    //Valido si existe la mascota
    const existeMascota = data.some((mascota) => mascota.nombre === nombre)

    if(existeMascota){
      alert("La mascota ya esta creada")
    }else{
      const body = JSON.stringify({
        nombre:mascota.nombre,
        raza:mascota.raza,
        edad:mascota.edad,
        estado:mascota.estado
      })

      const respuesta = await fetch("https://685208d68612b47a2c0be5cb.mockapi.io/Mascotas",{
        method:"POST",
        headers:{
           'Content-Type':'application/json',
        },
        body:body
      })
      const mascotaGuardada = await respuesta.json()
      setMascotas((prev) => [...prev,mascotaGuardada])
      setMascota({nombre:"",raza:"",edad:0,estado:true})
      alert("La mascota se guardo con exito")
    }

  }catch(error) {
  alert("Error en la conexion: ",error)
}
    }
  //formulario: 
  const handleFormulario = () => {
    setFormulario(true);
  };
  const guardarFormulario = () => {
    setFormulario(false);
  };
  console.log(formulario);
return (
    <View>
      <Button title="Agregar mascota" onPress={handleFormulario}></Button>
      {formulario && (
        <View>
          <Text>Nombre de la mascota:</Text>
          <TextInput 
          value= {mascota.nombre}
          onChangeText={nombre => setMascota({...mascota,nombre:nombre})}
          placeholder="Nombre"/>
          <Text>Raza de la mascota:</Text>
          <TextInput 
          value={mascota.raza}
          onChangeText={raza => setMascota({...mascota, raza:raza})}
          placeholder="Raza"/>
          <Text>Edad de tu mascota:</Text>
          <TextInput 
          value={mascotas.edad}
          onChangeText={edad => setMascota({...mascota, edad: edad})}
          placeholder="Edad"/>
          <Text>Estado de salud:</Text>
          <Switch 
          label="Sano"/>
          <Button title="Guardar mascota" onPress={agregarMascota}></Button>
          <Button title="X" onPress={guardarFormulario}></Button>
        </View>
      )}
    </View>
  );
  

  // const [mascotas, setMascotas] = useState([]);
  // const [mascota, setMascota] = useState({
  //   nombre: "", raza: "", edad: "", estadoSalud: true
  // });
  // const [form, setForm] = useState(false);

  // const mostrarForm = () => {
  //   setForm(true);
  // };

  // const agregarMascota = async () => {
  //   const { nombre, raza, edad, estadoSalud } = mascota;
  //   try {
  //     const response = await fetch("https://685208d68612b47a2c0be5cb.mockapi.io/Mascotas");
  //     const data = await response.json();

  //     const existeMascota = data.some(masc => masc.nombre === nombre && masc.raza === raza);

  //     if (existeMascota) {
  //       alert("La mascota ya existe");
  //     } else {
  //       const nuevaMascota = {
  //         nombre,
  //         raza,
  //         edad: Number(edad),
  //         estadoSalud
  //       };
  //       const resp = await fetch("https://685208d68612b47a2c0be5cb.mockapi.io/Mascotas", {
  //         method: "POST",
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(nuevaMascota)
  //       });
  //       const mascotaGuardada = await resp.json();
  //       setMascotas(prevMascotas => [...prevMascotas, mascotaGuardada]);
  //       setMascota({ nombre: "", raza: "", edad: "", estadoSalud: true });
  //       setForm(false);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // return (
  //   <View>
  //     <Text>Estoy en la lista de mascotas</Text>
  //     <Button title='Agregar mascota' onPress={mostrarForm} />
  //     {form && (
  //       <View>
  //         <View style={{ marginVertical: 10 }}>
  //           <Text>Nombre:</Text>
  //           <TextInput
  //             value={mascota.nombre}
  //             onChangeText={text => setMascota({ ...mascota, nombre: text })}
  //             placeholder="Nombre"
  //             style={{ borderWidth: 1, marginBottom: 5, padding: 5 }}
  //           />
  //           <Text>Raza:</Text>
  //           <TextInput
  //             value={mascota.raza}
  //             onChangeText={text => setMascota({ ...mascota, raza: text })}
  //             placeholder="Raza"
  //             style={{ borderWidth: 1, marginBottom: 5, padding: 5 }}
  //           />
  //           <Text>Edad:</Text>
  //           <TextInput
  //             value={mascota.edad.toString()}
  //             onChangeText={edad => setMascota({ ...mascota, edad })}
  //             placeholder="Edad"
  //             keyboardType="numeric"
  //             style={{ borderWidth: 1, marginBottom: 5, padding: 5 }}
  //           />
  //           <Text>Estado de Salud:</Text>
  //           <Switch
  //             value={mascota.estadoSalud}
  //             onValueChange={estado => setMascota({ ...mascota, estadoSalud: estado })}
  //           />
  //           <Button title="Guardar Mascota" onPress={agregarMascota} />
  //         </View>

  //         <Text>Lista de Mascotas:</Text>
  //         {mascotas.map((m, i) => (
  //           <Text key={m.id || i}>
  //             {m.nombre} - {m.raza} - {m.edad} años - {m.estadoSalud ? "Sano" : "Enfermo"}
  //           </Text>
  //         ))}
  //       </View>
  //     )}
  //   </View>
  // );

}

export default Mascotas;
