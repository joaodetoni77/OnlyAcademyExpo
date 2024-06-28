import React, { useState } from 'react'
import { Alert, TouchableOpacity, StyleSheet, View, AppState, ImageBackground, Text } from 'react-native'
import { supabase } from './lib/supabase'
import { Button, Input } from '@rneui/themed'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Por favor verifique seu e-mail para confirmar a criação da conta!')
    setLoading(false)
  }

  return (
    <ImageBackground style={styles.fotoFundo} source={require("./assets/fundo_usuario.jpg")}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Login</Text>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Input
            label="Email"
            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={'none'}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Senha"
            leftIcon={{ type: 'font-awesome', name: 'lock' }}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="123456"
            autoCapitalize={'none'}
          />
        </View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <TouchableOpacity
            onPress={() => signInWithEmail()}
            style={[styles.botao,]}
            disabled={loading}
          >
            <Text style={styles.botaoTexto}>Logar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.verticallySpaced}>
          <TouchableOpacity
            onPress={() => signUpWithEmail()}
            style={[styles.botao,]}
            disabled={loading}
          >
            <Text style={styles.botaoTexto}>Criar Conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  fotoFundo: {
    width: 450,
    height: 1000,
    borderRadius: 100,
    alignSelf: "center",
    marginTop: 5,
    borderColor: "#fff",
    borderWidth: 5,
  },
  titulo: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold"
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
    fontWeight: "bold",
  },
  mt20: {
    marginTop: 20,
  },
  botao: {
    backgroundColor: "#fff",
    borderRadius: 150,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginStart: 10,
    marginEnd: 10
  },
  botaoTexto: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    padding: 10,
  },
})