import React, { createContext, useContext, useState, useEffect } from "react";

const TurnosContext = createContext();
export const useTurnos = () => useContext(TurnosContext);

export default function TurnosProvider({ children }) {
  const [turnos, setTurnos] = useState([]);

  // Traer turnos de la API al iniciar
  useEffect(() => {
    fetchTurnos();
  }, []);

  const fetchTurnos = async () => {
    const res = await fetch('https://6856aaae1789e182b37eb8a7.mockapi.io/turno');
    const data = await res.json();
    setTurnos(data);
  };

  const agregarTurno = async (turno) => {
    await fetch('https://6856aaae1789e182b37eb8a7.mockapi.io/turno', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(turno),
    });
    fetchTurnos();
  };

  const eliminarTurno = async (id) => {
    await fetch(`https://6856aaae1789e182b37eb8a7.mockapi.io/turno/${id}`, {
      method: 'DELETE',
    });
    fetchTurnos();
  };

  const editarTurno = async (id, datosActualizados) => {
    await fetch(`https://6856aaae1789e182b37eb8a7.mockapi.io/turno/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosActualizados),
    });
    fetchTurnos();
  };

  return (
    <TurnosContext.Provider value={{
      turnos,
      agregarTurno,
      eliminarTurno,
      editarTurno
    }}>
      {children}
    </TurnosContext.Provider>
  );
}