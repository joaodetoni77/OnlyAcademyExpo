import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { StyleSheet, View, Alert, Image, TouchableOpacity, Text } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

interface Props {
    size: number
    url: string | null
    onUpload: (filePath: string) => void
}

export default function CoverPicture({ url, size = 150, onUpload }: Props) {
    const [uploading, setUploading] = useState(false)
    const [coverUrl, setCoverUrl] = useState<string | null>(null)
    const coverSize = { height: size, width: size }

    useEffect(() => {
        if (url) downloadImage(url)
    }, [url])

    async function downloadImage(path: string) {
        try {
            const { data, error } = await supabase.storage.from('OnlyAcademy').download(path)

            if (error) {
                throw error
            }

            const fr = new FileReader()
            fr.readAsDataURL(data)
            fr.onload = () => {
                setCoverUrl(fr.result as string)
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log('Error downloading image: ', error.message)
            }
        }
    }

    async function uploadCoverPicture() {
        try {
            setUploading(true)

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
                allowsMultipleSelection: false, // Can only select one image
                allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
                quality: 1,
                exif: false, // We don't want nor need that data.
            })

            if (result.canceled || !result.assets || result.assets.length === 0) {
                console.log('User cancelled image picker.')
                return
            }

            const image = result.assets[0]
            console.log('Got image', image)

            if (!image.uri) {
                throw new Error('No image uri!') // Realistically, this should never happen, but just in case...
            }

            const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer())

            const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg'
            const path = `${Date.now()}.${fileExt}`
            const { data, error: uploadError } = await supabase.storage
                .from('OnlyAcademy')
                .upload(path, arraybuffer, {
                    contentType: image.mimeType ?? 'image/jpeg',
                })

            if (uploadError) {
                throw uploadError
            }

            onUpload(data.path)
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            } else {
                throw error
            }
        } finally {
            setUploading(false)
        }
    }

    return (
        <View>
            {coverUrl ? (
                <Image
                    source={{ uri: coverUrl }}
                    accessibilityLabel="Cover"
                    style={[coverSize, styles.picture, styles.image]}
                />
            ) : (
                <View style={[coverSize, styles.picture, styles.noImage]} />
            )}
            <View>
                <TouchableOpacity
                    onPress={uploadCoverPicture}
                    style={[styles.botao,]}
                    disabled={uploading}
                >
                    <Text style={styles.botaoTexto}>{uploading ? 'Uploading ...' : 'Upload - Foto de Cover'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    picture: {
        borderRadius: 5,
        overflow: 'hidden',
        maxWidth: '100%',
    },
    image: {
        objectFit: 'cover',
        paddingTop: 0,
    },
    noImage: {
        backgroundColor: '#333',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgb(200, 200, 200)',
        borderRadius: 5,
    },
    botao: {
        backgroundColor: "#000",
        borderRadius: 150,
        paddingVertical: 5,
        paddingHorizontal: 5,
        marginStart: 0,
        marginEnd: 0
    },
    botaoTexto: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
        padding: 10,
    },
})