import { Slot } from 'expo-router'
import React from 'react'
import AuthProvider from '../context/AuthContext'


export default function _layout() {
  return (
    <AuthProvider>
      <Slot/>
    </AuthProvider>
  )
}
