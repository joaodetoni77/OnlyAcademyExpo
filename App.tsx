import React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./src/home";
import Camera from "./src/camera";
import PagamentoMensal from "./src/pagamentoMensal";
import PagamentoAnual from "./src/pagamentoAnual";
import escolhaPlano from "./src/escolhaPlano";

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
            <Stack.Screen name="Escolha o Plano" component={escolhaPlano} />
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

export default App;
