/*import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/

import { useReducer, useEffect, useMemo, createContext, Dispatch } from 'react';

import { PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import { Camera } from './src/pages/camera';

import { State } from 'react-native-paper/lib/typescript/components/TextInput/types';
// import { state, dispatch } from './src/config/Authentication';
// import { authContext, AuthContext } from './src/config/Authentication';

export const AuthContext = createContext({});


export type RootStack = {
  Camera: undefined;
}

const Stack = createNativeStackNavigator<RootStack>();

export default function App() {
  return (
    <PaperProvider>
      <AuthContext.Provider value={AuthContext}>
            (
              <>
                <Stack.Screen
                  name='Camera'
                  component={ Camera }
                  options={{ title: 'OnlyAcademy' }}
                />
              </>
            )
      </AuthContext.Provider>
    </PaperProvider>
  );
}