// App.js
import React from 'react';
import { StyleSheet, Text, View, Button, Alert, ImageBackground, TouchableOpacity, Pressable } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from "@react-navigation/native";

export default function EscolhaPlano() {
    const navigation = useNavigation();

    const navigationHome = () => {
        navigation.navigate("Home");
    };

    const navigationPagamentoMensal = () => {
        navigation.navigate("Pagamento Mensal");
    };

    const navigationPagamentoAnual = () => {
        navigation.navigate("Pagamento Anual");
    };


    return (
        <ImageBackground source={require("./assets/fundo_usuario.jpg")}>
            <View style={styles.container}>
                <Text style={styles.titulo}>Escolha a Categoria de Plano Desejada</Text>
                <TouchableOpacity onPress={navigationHome} style={[styles.botao, { marginRight: 10 }]}>
                    <Text style={styles.botaoTexto}>FREE</Text>
                </TouchableOpacity>
                <Text style={styles.legenda}>Uso normal do sistema</Text>
   
                <TouchableOpacity onPress={navigationPagamentoMensal} style={[styles.botao, { marginRight: 10 }]}>
                    <Text style={styles.botaoTexto}>PREMIUM MENSAL</Text>
                </TouchableOpacity>
                <Text style={styles.legenda}>Uso normal do sistema</Text>
                <Text style={styles.legenda}>Valor: 1.00</Text>
    
                <TouchableOpacity onPress={navigationPagamentoAnual} style={[styles.botao, { marginRight: 10 }]}>
                    <Text style={styles.botaoTexto}>PREMIUM ANUAL</Text>
                </TouchableOpacity>
                <Text style={styles.legenda}>Valor: 10.00</Text>
            </View>
        </ImageBackground >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    titulo: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
        fontWeight: "bold"
    },
    legenda: {
        fontSize: 16,
        textAlign: "center"
    },
    botao: {
        backgroundColor: "#fff",
        borderRadius: 150,
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    botaoTexto: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
        padding: 10,
    },
});
