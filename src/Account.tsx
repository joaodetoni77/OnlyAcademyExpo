import { useState, useEffect, DialogHTMLAttributes } from 'react'
import { supabase } from './lib/supabase'
import { StyleSheet, View, Alert, TextInput, TouchableOpacity, Text, ImageBackground, ScrollView } from 'react-native'
import { Button, Input } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import ProfilePicture from './ProfilePicture'
import CoverPicture from './CoverPicture'

export default function Account({ session }: { session: Session }) {
    const [loading, setLoading] = useState(true)
    const [id, setId] = useState('')
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [bio, setBio] = useState('')
    const [location, setLocation] = useState('')
    const [birthdate, setBirthdate] = useState<string>('')
    const [profile_picture, setProfilePicture] = useState('')
    const [cover_photo, setCoverPhoto] = useState('')

    useEffect(() => {
        if (session) getProfile()
    }, [session])

    async function getProfile() {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('Não existe usuário na sessão!')

            const { data, error, status } = await supabase
                .from('profile')
                .select(`id, first_name, last_name, bio, location, birthdate, profile_picture, cover_photo`)
                .eq('user_id', session?.user.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setId(data.id)
                setFirstName(data.first_name)
                setLastName(data.last_name)
                setBio(data.bio)
                setLocation(data.location)
                setBirthdate(data.birthdate)
                setProfilePicture(data.profile_picture)
                setCoverPhoto(data.cover_photo)
            } else {
                await createInitialProfile(session.user.id)
                getProfile()
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    async function createInitialProfile(userId: string) {
        try {
            const { data, error } = await supabase.from('profile').upsert([
                {
                    user_id: userId,
                },
            ])

            if (error) {
                throw error
            }

            if (data) {
                setFirstName('')
                setLastName('')
                setBio('')
                setLocation('')
                setBirthdate('')
                setProfilePicture('')
                setCoverPhoto('')
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile({
        first_name,
        last_name,
        bio,
        location,
        birthdate,
        profile_picture,
        cover_photo
    }: {
        first_name: string
        last_name: string
        bio: string
        location: string
        birthdate: string
        profile_picture: string
        cover_photo: string
    }) {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('Não existe usuário na sessão!')

            const updates = {
                id,
                user_id: session?.user.id,
                first_name,
                last_name,
                bio,
                location,
                birthdate,
                profile_picture,
                cover_photo,
                updated_at: new Date(),
            }

            const { error } = await supabase.from('profile').upsert(updates)

            if (error) {
                throw error
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <ScrollView>
            <ImageBackground style={styles.fotoFundo} source={require("./assets/fundo_usuario.jpg")}>
                <View style={styles.container}>
                    <Text style={styles.titulo}>Dados do Usuário</Text>
                    <View style={[styles.verticallySpaced, styles.mt10]}>
                        <TextInput placeholder="E-mail" style={styles.textInput} value={session?.user?.email} editable={false} />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt10]}>
                        <TextInput placeholder="Nome" style={styles.textInput} value={first_name || ''} onChangeText={(text) => setFirstName(text)} />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt10]}>
                        <TextInput placeholder="Sobrenome" style={styles.textInput} value={last_name || ''} onChangeText={(text) => setLastName(text)} />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt10]}>
                        <TextInput placeholder="Bio" style={styles.textInput} value={bio || ''} onChangeText={(text) => setBio(text)} />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt10]}>
                        <TextInput placeholder="Localização" style={styles.textInput} value={location || ''} onChangeText={(text) => setLocation(text)} />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt10]}>
                        <TextInput placeholder="Data de Aniversário" style={styles.textInput} value={birthdate.split('T')[0]} onChangeText={(date) => setBirthdate(date)} />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt10]}>
                        <ProfilePicture
                            size={0}
                            url={profile_picture}
                            onUpload={(urlProfile: string) => {
                                setProfilePicture(urlProfile)
                                updateProfile({ first_name, last_name, bio, location, birthdate, profile_picture: urlProfile, cover_photo })
                            }}
                        />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt10]}>
                        <CoverPicture
                            size={0}
                            url={cover_photo}
                            onUpload={(urlCover: string) => {
                                setCoverPhoto(urlCover)
                                updateProfile({ first_name, last_name, bio, location, birthdate, profile_picture, cover_photo: urlCover })
                            }}
                        />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt10]}>
                        <TouchableOpacity
                            onPress={() => updateProfile({ first_name, last_name, bio, location, birthdate, profile_picture: profile_picture, cover_photo: cover_photo })}
                            style={[styles.botao,]}
                            disabled={loading}
                        >
                            <Text style={styles.botaoTexto}>{loading ? 'Loading ...' : 'Inserir/Atualizar'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt10]}>
                        <TouchableOpacity
                            onPress={() => supabase.auth.signOut()}
                            style={[styles.botao,]}
                            disabled={loading}
                        >
                            <Text style={styles.botaoTexto}>Sair</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </ScrollView>
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
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt10: {
        marginTop: 10,
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