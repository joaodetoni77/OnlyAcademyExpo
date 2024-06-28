import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { Video } from 'expo-av';

interface Post {
    id: string;
    post_type: string;
    content: string;
    number: string;
    image_url: string;
    video_url: string;
    likes: string;
    shares: string;
}

interface PostListProps {
    session: Session;
}

const PostList: React.FC<PostListProps> = ({ session }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session) fetchPosts();
    }, [session]);

    async function fetchPosts() {
        try {
            setLoading(true);
            if (!session?.user) throw new Error('Não existe usuário na sessão!');

            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('user_id', session?.user.id)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            // Fetch the URLs for images and videos from Supabase storage
            const postsWithUrls = await Promise.all(data!.map(async (post: Post) => {
                try {
                    if (post.image_url) {
                        const { data: imageData } = await supabase
                            .storage
                            .from('OnlyAcademy')
                            .getPublicUrl(post.image_url);

                        post.image_url = imageData.publicUrl;
                    }

                    if (post.video_url) {
                        const { data: videoData } = await supabase
                            .storage
                            .from('OnlyAcademy')
                            .getPublicUrl(post.video_url);

                        post.video_url = videoData.publicUrl;
                    }

                    return post;
                } catch (error) {
                    console.error('Erro ao obter URL pública:', error instanceof Error ? error.message : error);
                    return post; // Retorna o post mesmo se ocorrer erro ao obter URL pública
                }
            }));

            setPosts(postsWithUrls);
        } catch (error) {
            console.error('Erro ao buscar posts:', error instanceof Error ? error.message : error);
            alert('Erro ao buscar posts. Por favor, tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (postId: string, imageUrl?: string, videoUrl?: string) => {
        try {
            // Excluir o registro da tabela 'posts'
            const { error: deleteError } = await supabase
                .from('posts')
                .delete()
                .eq('id', postId);

            if (deleteError) {
                throw deleteError;
            }

            // Se houver uma URL de imagem, excluir o arquivo correspondente no storage
            if (imageUrl) {
                const { error: imageError } = await supabase
                    .storage
                    .from('OnlyAcademy')
                    .remove([imageUrl]);

                if (imageError) {
                    throw imageError;
                }
            }

            // Se houver uma URL de vídeo, excluir o arquivo correspondente no storage
            if (videoUrl) {
                const { error: videoError } = await supabase
                    .storage
                    .from('OnlyAcademy')
                    .remove([videoUrl]);

                if (videoError) {
                    throw videoError;
                }
            }

            // Atualizar a lista de posts localmente após a exclusão no banco de dados e no storage
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Erro ao deletar post:', error instanceof Error ? error.message : error);
            alert('Erro ao deletar post. Por favor, tente novamente mais tarde.');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.postContainer}>
                    <Text style={styles.postTitle}>{item.post_type}</Text>
                    <Text>{`Número: ${item.number}`}</Text>
                    <Text>{item.content}</Text>
                    {item.image_url && <Image source={{ uri: item.image_url }} style={styles.postImage} />}
                    {item.video_url && <Video source={{ uri: item.video_url }} style={styles.postVideo} useNativeControls />}
                    <Text>{`Likes: ${item.likes} Shares: ${item.shares}`}</Text>
                    <TouchableOpacity onPress={() => handleDelete(item.id, item.image_url, item.video_url)} style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Excluir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => supabase.auth.signOut()} style={styles.buttonSignOut} disabled={loading}>
                        <Text style={styles.buttonTextSignOut}>Sair</Text>
                    </TouchableOpacity>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postContainer: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    postTitle: {
        backgroundColor: '#000',
        color: '#fff',
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
        fontWeight: "bold"
    },
    postImage: {
        width: '100%',
        height: 200,
        marginTop: 10,
        borderRadius: 8,
    },
    postVideo: {
        width: '100%',
        height: 200,
        marginTop: 10,
        borderRadius: 8,
    },
    buttonSignOut: {
        backgroundColor: '#000',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonTextSignOut: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16
    },
    deleteButton: {
        backgroundColor: '#ff6347',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default PostList;
