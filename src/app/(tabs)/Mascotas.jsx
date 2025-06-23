import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Image,
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Mascotas() {
  const [formulario, setFormulario] = useState(false);
  const [mascota, setMascota] = useState({
    nombre: "",
    especie: "",
    raza: "",
    edad: 0,
    salud: "SANO",
    duenio: "",
  });

  const [mascotas, setMascotas] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const opcionesSalud = ["SANO", "ENFERMO", "VACUNADO", "NO VACUNADO"];
  //Agregar campos: especie,dueño => listo
  //Agregar que cuando se agregue la mascota se cierre el formulario => listo
  //Agregar funcion de agregar imagen de mascota => listo
  //Validar que en edad se agreguen solo numeros.
  //Validar que no se admitan campos vacios cuando se agregue una mascota
  useEffect(() => {
    initMascotasInfo();
  }, []);

  const initMascotasInfo = async () => {
    const userInfo = await getUserInfo();
    const mascotasInfo = await fetch(
      "https://685208d68612b47a2c0be5cb.mockapi.io/Mascotas"
    );
    const data = await mascotasInfo.json();
    const mascotasFiltradas = data.filter((m) => m.duenio === userInfo.name);

    setMascotas(mascotasFiltradas);
  };
  const agregarMascota = async () => {
    try {
      const response = await fetch(
        "https://685208d68612b47a2c0be5cb.mockapi.io/Mascotas"
      );
      const data = await response.json();

      //Valido si existe la mascota
      const existeMascota = data.some((m) => m.nombre === mascota.nombre);

      //validar campos vacios
      if (existeMascota) {
        alert("La mascota ya esta creada");
      } else if (
        mascota.nombre === "" ||
        mascota.especie === "" ||
        mascota.raza === "" ||
        mascota.edad === "" ||
        isNaN(Number(mascota.edad)) ||
        Number(mascota.edad) <= 0
      ) {
        alert(
          "Todos los campos se tienen que llenar y la edad debe ser un número mayor a 0"
        );
      } else {
        const user = await getUserInfo();
        const body = JSON.stringify({
          nombre: mascota.nombre,
          especie: mascota.especie,
          raza: mascota.raza,
          edad: Number(mascota.edad),
          salud: mascota.salud,
          duenio: user.name,
        });

        const respuesta = await fetch(
          "https://685208d68612b47a2c0be5cb.mockapi.io/Mascotas",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: body,
          }
        );
        const mascotaGuardada = await respuesta.json();
        setMascotas((prev) => [...prev, mascotaGuardada]);
        setMascota({
          nombre: "",
          especie: "",
          raza: "",
          edad: 0,
          salud: "SANO",
        });
        alert("La mascota se guardo con exito");
        setFormulario(false);
      }
    } catch (error) {
      alert("Error en la conexion: " + error);
    }
  };

  const eliminarMascota = async (id) => {
    try {
      const respuesta = await fetch(
        `https://685208d68612b47a2c0be5cb.mockapi.io/Mascotas/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (respuesta.ok) {
        setMascotas((prev) => prev.filter((m) => m.id !== id));
        alert("Mascota eliminada");
      } else {
        alert("No se pudo eliminar la mascota");
      }
    } catch (error) {
      alert("Error al eliminar: " + error);
      console.log(error);
    }
  };

  const editarMascota = async (id) => {
    try {
      //creo el body para enviar al "backend"
      const body = JSON.stringify({
        nombre: mascota.nombre,
        especie: mascota.especie,
        raza: mascota.raza,
        edad: mascota.edad,
        salud: mascota.salud,
      });
      const respuesta = await fetch(
        `https://685208d68612b47a2c0be5cb.mockapi.io/Mascotas/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        }
      );
      if (respuesta.ok) {
        //--------
        const mascotaEditada = await respuesta.json();
        setMascotas((prev) =>
          prev.map((m) => (m.id === id ? mascotaEditada : m))
        );
        setMascota({
          nombre: "",
          especie: "",
          raza: "",
          edad: 0,
          salud: "SANO",
        });
        setFormulario(false);
        setEditando(false);
        setIdEditando(null);
        alert("Mascota modificada");
      } else {
        alert("No se pudo modificar la mascota");
      }
    } catch (error) {
      alert("Error al modificar: " + error);
      console.log(error);
    }
  };

  const getUserInfo = async () => {
    const user = await AsyncStorage.getItem("user");
    const userObj = await JSON.parse(user);
    const userData = await fetch(
      `https://684372c771eb5d1be030d94d.mockapi.io/users/${userObj.id}`
    );
    const userInfo = await userData.json();
    return userInfo;
  };

  const cambiarImagenMascota = async (id) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos", "livePhotos"],
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled) {
        throw "Cancelado";
      }

      //const userInfo = await getUserInfo()
      await fetch(
        `https://685208d68612b47a2c0be5cb.mockapi.io/Mascotas/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatar: result.assets[0].uri }),
        }
      );
      setMascotas((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, avatar: result.assets[0].uri } : m
        )
      );
      setProfileImg(result.assets[0].uri);
    } catch (error) {
      console.log(`Error al tomar la imagen: ${error}`);
      alert(`Error al tomar la imagen: ${error}`);
    }
  };
  //formulario:
  const handleFormulario = () => {
    setFormulario(true);
  };
  // const guardarFormulario = () => {
  //   setFormulario(false);
  // };

  return (
    <ScrollView>
      <View>
        <View style={styles.contenedorMap}>
          {mascotas.map((masc) => {
            return (
              <View key={masc.id} style={styles.contenedor}>
                <View style={styles.contenedorAcciones}>
                  <TouchableOpacity onPress={() => eliminarMascota(masc.id)}>
                    <Text style={styles.acciones}>X</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setEditando(true);
                      setIdEditando(masc.id);
                      setMascota({
                        nombre: masc.nombre,
                        especie: masc.especie,
                        raza: masc.raza,
                        edad: masc.edad,
                        salud: masc.salud,
                      });
                      setFormulario(true);
                    }}
                  >
                    <Text style={styles.acciones}>Editar</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => cambiarImagenMascota(masc.id)}>
                  <Image source={{ uri: masc.avatar }} style={styles.img} />
                </TouchableOpacity>
                <Text style={styles.texto} numberOfLines={2}>
                  Nombre: {masc.nombre}
                </Text>
                <Text style={styles.texto} numberOfLines={2}>
                  Especie: {masc.especie}
                </Text>
                <Text style={styles.texto} numberOfLines={2}>
                  Raza: {masc.raza}
                </Text>
                <Text style={styles.texto} numberOfLines={2}>
                  Edad: {masc.edad}
                </Text>
                <Text style={styles.texto} numberOfLines={2}>
                  Salud:{masc.salud}
                </Text>
                <Text style={styles.texto} numberOfLines={2}>
                  Dueño: {masc.duenio}
                </Text>
              </View>
            );
          })}
        </View>
        <TouchableOpacity style={styles.touchable} onPress={handleFormulario}>
          <Text style={styles.touchableText}>Agregar mascota</Text>
        </TouchableOpacity>
        {formulario && (
          <View style={styles.contenedorFormulario}>
            <TouchableOpacity
              style={styles.touchableSalir}
              onPress={() => {
                setFormulario(false);
                setEditando(false);
                setMascota({
                  nombre: "",
                  raza: "",
                  edad: 0,
                  salud: "SANO",
                });
              }}
            >
              <Text style={styles.touchableSalirTexto}>X</Text>
            </TouchableOpacity>
            <Text style={styles.textoFormulario}>Nombre de la mascota:</Text>
            <TextInput
              value={mascota.nombre}
              onChangeText={(nombre) =>
                setMascota({ ...mascota, nombre: nombre })
              }
              placeholder="Nombre"
              style={styles.inputFormulario}
            />
            <Text style={styles.textoFormulario}>Especie de la mascota:</Text>
            <TextInput
              value={mascota.especie}
              onChangeText={(especie) =>
                setMascota({ ...mascota, especie: especie })
              }
              placeholder="Especie"
              style={styles.inputFormulario}
            />
            <Text style={styles.textoFormulario}>Raza de la mascota:</Text>
            <TextInput
              value={mascota.raza}
              onChangeText={(raza) => setMascota({ ...mascota, raza: raza })}
              placeholder="Raza"
              style={styles.inputFormulario}
            />
            <Text style={styles.textoFormulario}>Edad de tu mascota:</Text>
            <TextInput
              value={mascota.edad}
              onChangeText={(edad) => setMascota({ ...mascota, edad: edad })}
              placeholder="Edad"
              style={styles.inputFormulario}
            />
            <Text style={styles.textoFormulario}>Estado de salud:</Text>
            <Picker
              value={mascota.salud}
              onValueChange={(itemValue, itemIndex) => {
                setMascota({ ...mascota, salud: itemValue });
                setSelectedIndex(itemIndex);
              }}
              style={{ height: 100 }}
            >
              {opcionesSalud.map((opcion, idx) => (
                <Picker.Item label={opcion} value={opcion} key={idx} />
              ))}
            </Picker>
            <View style={styles.touchableGuardarContainer}>
              <TouchableOpacity
                style={styles.touchableGuardar}
                onPress={
                  editando ? () => editarMascota(idEditando) : agregarMascota
                }
              >
                <Text style={styles.touchableGuardarTexto}>
                  {editando ? "Guardar cambios" : "Guardar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
} //
const styles = StyleSheet.create({
  contenedorMap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    minHeight: 100,
    padding: 10,
    marginLeft: 25,
  },
  contenedor: {
    borderColor: "black",
    borderWidth: 2,
    margin: 5,
    padding: 5,
    width: 160,
    height: 310,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
  },
  img: {
    width: 105,
    height: 105,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  texto: {
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 2,
    maxWidth: 120, // <-- limita el ancho del texto
    flexShrink: 1, // <-- permite que el texto se achique si es necesario
  },
  touchable: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#85c1e9",
    width: "auto",
    borderRadius: 25,
    padding: 8,
    marginBottom: 10,
  },
  touchableText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "800",
  },
  contenedorFormulario: {
    backgroundColor: "white",
    borderWidth: 3,
    padding: 10,
    margin: 10,
  },
  textoFormulario: {
    fontSize: 20,
    textAlign: "center",
  },
  inputFormulario: {
    textAlign: "center",
  },
  touchableGuardarContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  touchableGuardar: {
    backgroundColor: "#85c1e9",
    width: 90,
    height: 40,
    padding: 10,
    borderRadius: 10,
    flex: 1,
  },
  touchableSalir: {
    width: 20,
  },
  touchableGuardarTexto: {
    fontWeight: "800",
    textAlign: "center",
  },
  touchableSalirTexto: {
    textAlign: "center",
    fontSize: 20,
  },
  contenedorAcciones: {
    flexDirection: "row",
    gap: 50,
    justifyContent: "center",
  },
  acciones: {
    fontSize: 20,
    fontWeight: "800",
  },
});

export default Mascotas;
