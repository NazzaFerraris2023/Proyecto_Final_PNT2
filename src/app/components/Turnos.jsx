import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTurnos } from '../../context/TurnosContext';
import { useAuth } from '../../context/AuthContext';


export default function Turnos() {
  const { turnos, agregarTurno, eliminarTurno, editarTurno } = useTurnos();
  const { user } = useAuth();
    if (!user) return <Text>Cargando usuario...</Text>;
  const [form, setForm] = useState({ fechaTurno: '', especialidad: '', nombreMascota: '', id: '' });
  const [editando, setEditando] = useState(false);
  



//   // Solo los turnos del usuario actual
  const turnosUsuario = turnos.filter(turno => turno.name === user?.name);

  const handleGuardar = () => {
    if (editando) {
      editarTurno(form.id, form);
      setEditando(false);
    } else {
      agregarTurno({ ...form, id: Date.now().toString(), name: user?.name });
    }
    setForm({ fechaTurno: '', especialidad: '', nombreMascota: '', id: '' });
  };

  const handleEditar = (turno) => {
    setForm(turno);
    setEditando(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{editando ? 'Editar Turno' : 'Nuevo Turno'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Fecha"
        value={form.fechaTurno}
        onChangeText={text => setForm({ ...form, fechaTurno: text })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Especialidad"
        value={form.especialidad}
        onChangeText={text => setForm({ ...form, especialidad: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre Mascota"
        value={form.nombreMascota}
        onChangeText={text => setForm({ ...form, nombreMascota: text })}
      />
      <Button title={editando ? 'Guardar Cambios' : 'Agregar Turno'} onPress={handleGuardar} />

      <FlatList
        data={turnosUsuario}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.turnoItem}>
            <Text>
              {new Date(Number(item.fechaTurno)).toLocaleDateString()} - {item.especialidad} - {item.nombreMascota}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => handleEditar(item)}>
                <Text style={styles.edit}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => eliminarTurno(item.id)}>
                <Text style={styles.delete}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noTurno}>No tenés turnos cargados.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { margin: 16, padding: 16, backgroundColor: '#64b5f6', borderRadius: 8 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#1565c0' },
  input: { borderWidth: 1, borderColor: '#90caf9', marginBottom: 8, padding: 8, borderRadius: 4, backgroundColor: '#fff' },
  turnoItem: { backgroundColor: '#fff', padding: 8, marginVertical: 4, borderRadius: 4 },
  edit: { color: '#1565c0', marginRight: 16 },
  delete: { color: '#b71c1c' },
  noTurno: { fontSize: 16, color: '#b71c1c', textAlign: 'center', marginTop: 8 },
});