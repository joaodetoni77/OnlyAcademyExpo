/*import React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./src/Home";
import Camera from "./src/Camera";
import PagamentoMensal from "./src/PagamentoMensal";
import PagamentoAnual from "./src/PagamentoAnual";
import EscolhaPlano from "./src/EscolhaPlano";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <View style={styles.column}>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Camera" component={Camera} />
            <Stack.Screen name="Pagamento Mensal" component={PagamentoMensal} />
            <Stack.Screen name="Pagamento Anual" component={PagamentoAnual} />
            <Stack.Screen name="Escolha o Plano" component={EscolhaPlano} />
          </Stack.Navigator>
        </View>
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  column: {
    flex: 1,
  },
});

export default App;*/

/*import { useState, useEffect } from 'react'
import { supabase } from './src/lib/supabase'
import Auth from './src/Auth'
import Account from './src/Account'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <View>
      {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
    </View>
  )
}*/

import { useState, useEffect } from 'react'
import { supabase } from './src/lib/supabase'
import Auth from './src/Auth'
import Account from './src/Account'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import Posts from "./src/Posts";
import PostList from './src/PostsList'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <View>
      {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
    </View>
  )
}