import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Video from 'react-native-video';
import { supabase } from './lib/supabase';

interface Props {
    size: number;
    url: string | null;
    onUpload: (filePath: string) => void;
}

export default function ProfileVideo({ url, size = 150, onUpload }: Props) {
    const [uploading, setUploading] = useState(false);
    const [profileUrl, setProfileUrl] = useState<string | null>(null);
    const profileSize = { height: size, width: size };

    useEffect(() => {
        if (url) downloadVideo(url);
    }, [url]);

    async function downloadVideo(path: string) {
        try {
            const { data, error } = await supabase.storage.from('OnlyAcademy').download(path);
            if (error) {
                throw error;
            }

            const fr = new FileReader();
            fr.readAsDataURL(data);
            fr.onload = () => {
                setProfileUrl(fr.result as string);
            };
        } catch (error) {
            if (error instanceof Error) {
                console.log('Error downloading video: ', error.message);
            }
        }
    }

    async function uploadProfileVideo() {
        try {
            setUploading(true);

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsMultipleSelection: false,
                allowsEditing: true,
                quality: 1,
            });

            if (result.canceled || !result.assets || result.assets.length === 0) {
                console.log('User cancelled video picker.');
                return;
            }

            const video = result.assets[0];
            console.log('Got video', video);

            if (!video.uri) {
                throw new Error('No video uri!');
            }

            const arraybuffer = await fetch(video.uri).then((res) => res.arrayBuffer());

            const fileExt = video.uri?.split('.').pop()?.toLowerCase() ?? 'mp4';
            const path = `${Date.now()}.${fileExt}`;
            const { data, error: uploadError } = await supabase.storage
                .from('OnlyAcademy')
                .upload(path, arraybuffer, {
                    contentType: video.mimeType ?? 'video/mp4',
                });

            if (uploadError) {
                throw uploadError;
            }

            onUpload(data.path);
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            } else {
                throw error;
            }
        } finally {
            setUploading(false);
        }
    }

    return (
        <View>
            {profileUrl ? (
                <Video
                    source={{ uri: profileUrl }}
                    style={[profileSize, styles.video]}
                    controls
                    resizeMode="contain"
                />
            ) : (
                <View style={[profileSize, styles.video, styles.noVideo]} />
            )}
            <View>
                <TouchableOpacity
                    onPress={uploadProfileVideo}
                    style={[styles.botao]}
                    disabled={uploading}
                >
                    <Text style={styles.botaoTexto}>{uploading ? 'Uploading ...' : 'Upload - Vídeo de Perfil'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    video: {
        borderRadius: 5,
        overflow: 'hidden',
        maxWidth: '100%',
    },
    noVideo: {
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
        marginEnd: 0,
    },
    botaoTexto: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
        padding: 10,
    },
});