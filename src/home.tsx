import React, { useState } from "react";
import { View, Button, StyleSheet, TouchableOpacity, Text, Image, ScrollView, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
    const navigation = useNavigation();
    const [isFollowActive, setFollowActive] = useState(false);

    const toggleFollow = () => {
        setFollowActive(!isFollowActive);
    };

    const navigateToCamera = () => {
        navigation.navigate("Camera");
    };

    return (
        <ImageBackground
            source={require("./assets/fundo_usuario.jpg")}
        >
            <Image source={require("./assets/joao_vitor_detoni.jpg")} style={styles.foto} />
            <View>
                <Text style={styles.nomeUsuario}>@joao_vitor_detoni</Text>
                <Text style={styles.descricaoUsuario}>
                    Meu nome é João Vitor Detoni. Eu sou Analista de Qualidade de Software e Estudante de Engenharia de Software.
                </Text>
            </View>
            <View style={styles.container}>
                <View style={styles.botaoPadronizado}>
                    <TouchableOpacity
                        onPress={toggleFollow}
                        style={[
                            styles.botao,
                            isFollowActive ? styles.botaoSeguir : styles.botaoSeguindo,
                            { marginRight: 20 }
                        ]}
                    >
                        <Text style={styles.botaoTexto}>
                            {isFollowActive ? "Seguindo" : "Seguir"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={navigateToCamera}
                        style={[styles.botao,]}
                    >
                        <Text style={styles.botaoTexto}>Camera</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    botaoPadronizado: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
        paddingBottom: 30,
    },
    botao: {
        backgroundColor: "#fff",
        borderRadius: 150,
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    botaoSeguir: {
        backgroundColor: "#0000FF",
    },
    botaoSeguindo: {
        backgroundColor: "#4169E1",
    },
    botaoTexto: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
        padding: 10,
    },
    foto: {
        width: 100,
        height: 100,
        borderRadius: 100,
        alignSelf: "center",
        marginTop: 5,
        borderColor: "#fff",
        borderWidth: 5,
    },
    nomeUsuario: {
        alignSelf: "center",
        marginTop: 8,
        fontSize: 16,
        fontWeight: "bold",
    },
    descricaoUsuario: {
        textAlign: "center",
        alignSelf: "center",
        marginTop: 12,
        fontSize: 14,
    }
});
