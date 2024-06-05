import React, { useState } from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text, TextInput, Image, ScrollView, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from './config/axios';
import modalPagamento from './modalPagamento';

export default function PagamentoMensal() {
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [locality, setLocality] = useState('');
    const [city, setCity] = useState('');
    const [regionCode, setRegionCode] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [taxId, setTaxId] = useState('');
    const [area, setArea] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [holderName, setHolderName] = useState('');
    const [expMonth, setExpMonth] = useState('');
    const [expYear, setExpYear] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [securityCode, setSecurityCode] = useState('');

    const [showModal, setShowModal] = useState(false);

    const navigation = useNavigation();

    const navigationHome = () => {
        alert("Pagamento Mensal realizado com Sucesso!");
        navigation.navigate("Home");
    };

    const handleSubmit = () => {
        const data = {
            plan: { id: 'PLAN_48D951F4-75DB-4EFF-B2F2-323BA652C2C4' },
            customer: {
                address: {
                    street: street,
                    number: number,
                    complement: complement,
                    locality: locality,
                    city: city,
                    region_code: 'PR',
                    country: 'BRA',
                    postal_code: postalCode,
                },
                email: email,
                name: name,
                tax_id: taxId,
                phones: [{ area: area, country: '55', number: phoneNumber }],
                birth_date: birthDate,
                billing_info: [
                    {
                        card: {
                            holder: {
                                name: holderName,
                                birth_date: birthDate,
                                tax_id: taxId,
                            },
                            exp_year: expYear,
                            exp_month: expMonth,
                            number: cardNumber,
                        },
                        type: 'CREDIT_CARD',
                    },
                ],
            },
            amount: { value: 100, currency: 'BRL' },
            reference_id: 'subscription-h',
            payment_method: [
                { type: 'CREDIT_CARD', card: { security_code: securityCode } },
            ],
            pro_rata: false,
        };

        const token = "D5F8D25B4E66410F916A32D834E7D0E4";
        console.log(data);

        axios.post(
            'https://sandbox.api.assinaturas.pagseguro.com/subscriptions',
            data,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            },
        ).then(response => {
            console.log(response.data);
            setShowModal(true);
        }).catch(error => {
            if (error.response) {
                console.error('Erro de resposta do servidor:', error.response.data);
            } else if (error.request) {
                console.error('Sem resposta do servidor:', error.request);
            } else {
                console.error('Erro ao configurar a requisição:', error.message);
            }
        });
    };

    return (
        <ImageBackground
            source={require("./assets/fundo_usuario.jpg")}
        >
            <ScrollView>
                <View style={styles.container}>

                    <Text style={styles.titulo}>Informe os Dados do Cartão Relacionados com o Pagamento Mensal</Text>

                    <Text style={styles.titulo}>Dados de Endereço</Text>
                    <TextInput placeholder="Rua" style={styles.textInput} value={street} onChangeText={setStreet} />
                    <TextInput placeholder="Número" style={styles.textInput} value={number} onChangeText={setNumber} />
                    <TextInput placeholder="Complemento" style={styles.textInput} value={complement} onChangeText={setComplement} />
                    <TextInput placeholder="Bairro" style={styles.textInput} value={locality} onChangeText={setLocality} />
                    <TextInput placeholder="Cidade" style={styles.textInput} value={city} onChangeText={setCity} />
                    <TextInput placeholder="Estado" style={styles.textInput} value={regionCode} onChangeText={setRegionCode} />
                    <TextInput placeholder="CEP" style={styles.textInput} value={postalCode} onChangeText={setPostalCode} />

                    <Text style={styles.titulo}>Demais Dados</Text>
                    <TextInput placeholder="E-mail" style={styles.textInput} value={email} onChangeText={setEmail} />
                    <TextInput placeholder="Nome" style={styles.textInput} value={name} onChangeText={setName} />
                    <TextInput placeholder="CPF" style={styles.textInput} value={taxId} onChangeText={setTaxId} />
                    <TextInput placeholder="DDD" style={styles.textInput} value={area} onChangeText={setArea} />
                    <TextInput placeholder="Telefone" style={styles.textInput} value={phoneNumber} onChangeText={setPhoneNumber} />
                    <TextInput placeholder="Data de Nascimento" style={styles.textInput} value={birthDate} onChangeText={setBirthDate} />

                    <Text style={styles.titulo}>Dados do Cartão</Text>
                    <TextInput placeholder="Nome do Cartão" style={styles.textInput} value={holderName} onChangeText={setHolderName} />
                    <TextInput placeholder="Ano de Expiração" style={styles.textInput} value={expYear} onChangeText={setExpYear} />
                    <TextInput placeholder="Mês de Expiração" style={styles.textInput} value={expMonth} onChangeText={setExpMonth} />
                    <TextInput placeholder="Número do Cartão" style={styles.textInput} value={cardNumber} onChangeText={setCardNumber} />
                    <TextInput placeholder="Código de Segurança" style={styles.textInput} value={securityCode} onChangeText={setSecurityCode} />
                    <TouchableOpacity style={styles.botao} onPress={handleSubmit}>
                        <Text style={styles.botaoTexto}>Assinar Plano</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ImageBackground >
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
    }
});
