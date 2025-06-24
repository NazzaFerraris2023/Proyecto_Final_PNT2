import { Slot } from 'expo-router'
import React from 'react'
import AuthProvider from '../context/AuthContext'
import TurnosProvider from '../context/TurnosContext'


export default function _layout() {
  return (
    <AuthProvider>
      <TurnosProvider>
        <Slot/>  
      </TurnosProvider>
    </AuthProvider>
  )
}
