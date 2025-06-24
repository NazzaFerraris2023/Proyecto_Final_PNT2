import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTurnos } from '../../context/TurnosContext';
import { useAuth } from '../../context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function Turnos() {
  const { turnos, agregarTurno, eliminarTurno, editarTurno } = useTurnos();
  const { user } = useAuth();
    if (!user) return <Text>Cargando usuario...</Text>;
  const [form, setForm] = useState({ fechaTurno: '', especialidad: '', nombreMascota: '', id: '' });
  const [editando, setEditando] = useState(false);
  
  const [showDatePicker, setShowDatePicker] = useState(false);


  const turnosUsuario = turnos.filter(turno => turno.name === user?.name);


//aca va formatear fecha
  function formatearFecha(fecha) {
  if (!fecha) return '';
  const d = new Date(fecha);
  if (isNaN(d)) return fecha; // Si no es una fecha válida, muestra el texto original
  return d.toLocaleDateString(); // O usa 'es-AR' si prefieres: d.toLocaleDateString('es-AR')
  }


  const handleGuardar = () => {
    if (editando) {
      editarTurno(form);
      setEditando(false);
    } else {
      agregarTurno({ ...form, name: user?.name });
    }
    setForm({ 
      fechaTurno: '',
      especialidad: '',
      nombreMascota: '',
    });
  };

  const handleEditar = (turno) => {
    setForm(turno);
    setEditando(true);
  };

  //despues del cambio de fecha
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker (false);
    if (selectedDate) {
      setForm ({ ...form, fechaTurno: selectedDate.Date.toISOString()})
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{editando ? 'Editar Turno' : 'Nuevo Turno'}</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>
          {form.fechaTurno ? formatearFecha(form.fechaTurno) : 'Seleccionar Fecha'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={form.fechaTurno ? new Date(form.fechaTurno) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setForm({ ...form, fechaTurno: selectedDate.toISOString() });
            }
          }}
        />
      )}
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
              {formatearFecha(item.fechaTurno)} - {item.especialidad} - {item.nombreMascota}
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