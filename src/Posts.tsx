import { useState, useEffect, DialogHTMLAttributes } from 'react'
import { supabase } from './lib/supabase'
import { StyleSheet, View, Alert, TextInput, TouchableOpacity, Text, ImageBackground, ScrollView } from 'react-native'
import { Button, Input } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import PostPicture from './PostPicture'
import PostVideoPicture from './PostVideoPicture'

export default function Posts({ session }: { session: Session }) {
    const [loading, setLoading] = useState(true)
    const [id, setId] = useState('')
    const [post_type, setPostType] = useState('')
    const [content, setContent] = useState('')
    const [number, setNumber] = useState('')
    const [image_url, setImageUrl] = useState('')
    const [video_url, setVideoUrl] = useState('')
    const [likes, setLikes] = useState('0')
    const [shares, setShares] = useState('0')

    useEffect(() => {
        if (session) getPost()
    }, [session])

    async function getPost() {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('Não existe usuário na sessão!')
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    async function updatePosts({
        post_type,
        content,
        number,
        image_url,
        video_url,
        likes,
        shares
    }: {
        post_type: string
        content: string
        number: string
        image_url: string
        video_url: string
        likes: string
        shares: string
    }) {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('Não existe usuário na sessão!')

            const updates = {
                user_id: session?.user.id,
                post_type,
                content,
                number,
                image_url,
                video_url,
                likes,
                shares,
                updated_at: new Date(),
            }

            const { error } = await supabase.from('posts').upsert(updates)

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
                    <Text style={styles.titulo}>Dados do Post</Text>
                    <View style={[styles.verticallySpaced, styles.mt10]}>
                        <TextInput placeholder="E-mail" style={styles.textInput} value={session?.user?.email} editable={false} />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt10]}>
                        <TextInput placeholder="Tipo da Postagem" style={styles.textInput} value={post_type || ''} onChangeText={(text) => setPostType(text)} />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt10]}>
                        <TextInput placeholder="Conteúdo" style={styles.textInput} value={content || ''} onChangeText={(text) => setContent(text)} />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt10]}>
                        <TextInput placeholder="Número" style={styles.textInput} value={number || ''} onChangeText={(text) => setNumber(text)} />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt10]}>
                        <PostPicture
                            size={0}
                            url={image_url}
                            onUpload={(urlImage: string) => {
                                setImageUrl(urlImage)
                                updatePosts({ post_type, content, number, image_url: urlImage, video_url, likes, shares })
                            }}
                        />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt10]}>
                        <PostVideoPicture
                            size={0}
                            url={video_url}
                            onUpload={(urlVideo: string) => {
                                setVideoUrl(urlVideo)
                                updatePosts({ post_type, content, number, image_url, video_url: urlVideo, likes, shares })
                            }}
                        />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt10]}>
                        <TextInput placeholder="Likes" style={styles.textInput} value={likes || ''} onChangeText={(text) => setLikes(text)} editable={false}/>
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt10]}>
                        <TextInput placeholder="Compartilhamentos" style={styles.textInput} value={shares || ''} onChangeText={(text) => setShares(text)} editable={false}/>
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt10]}>
                        <TouchableOpacity
                            onPress={() => updatePosts({ post_type, content, number, image_url: image_url, video_url: video_url, likes, shares })}
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