import React from "react";
import { View, Button, StyleSheet, TouchableOpacity, Text, TextInput, Image, ScrollView, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function PagamentoMensal() {
    const navigation = useNavigation();

    const navigationHome = () => {
        alert("Pagamento Mensal realizado com Sucesso!");
        navigation.navigate("Home");
    };

    return (
        <ImageBackground
            source={require("./assets/fundo_usuario.jpg")}
        >
            <View style={styles.container}>
                <Text style={styles.titulo}>Informe os Dados do Cartão Relacionados com o Pagamento Mensal</Text>

                <TextInput placeholder="Informe a Data de Validade do Cartão" style={styles.textInput} />
                <TextInput placeholder="Informe o Número do Cartão" style={styles.textInput} />
                <TextInput placeholder="Informe o Nome do Responsável do Cartão" style={styles.textInput} />
                <TextInput placeholder="Informe o CVV" style={styles.textInput} secureTextEntry />

                <TouchableOpacity style={styles.botao} onPress={navigationHome}>
                    <Text style={styles.botaoTexto}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    titulo: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
        fontWeight: "bold"
    },
    textInput: {
        width: "100%",
        height: 50,
        backgroundColor: "#fff",
        borderColor: "#000",
        borderRadius: 150,
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
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
