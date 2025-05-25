import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useAppSelector} from '../store';
import Modal from 'react-native-modal';
import axios from 'axios';
import moment from 'moment';

const CommunityScreen = () => {
  const navigation = useNavigation();
  const {token} = useAppSelector(state => state.auth);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddPost = () => {
    if (!token) {
      setModalVisible(true);
      return;
    }
    navigation.navigate('AddPost');
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, []),
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.log('Error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = (postId: string) => {
    navigation.navigate('Comment', {postId});
  };

  const handleLike = async (postId: string) => {
    if (!token) {
      setModalVisible(true);
      return;
    }
    try {
      const response = await axios.post(
        `https://recipe-app-anzh.onrender.com/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setPosts(posts.map(post => (post._id === postId ? response.data : post)));
    } catch (error) {
      console.log('Error', error);
    }
  };

  const renderPost = ({item}: {item: any}) => (
    <View style={styles.postContainer}>
      <Image
        source={{uri: `https://recipe-app-anzh.onrender.com${item.imageUrl}`}}
        style={styles.postImage}
      />
      <View style={styles.postInfo}>
        <Text style={styles.username}>{item?.userId.name}</Text>
        <Text style={styles.time}>{moment(item?.createdAt).fromNow()}</Text>
        <Text style={styles.recipeName}>{item?.recipeName}</Text>
        <Text style={styles.description}>{item?.description}</Text>

        <View style={styles.interaction}>
          <TouchableOpacity
            onPress={() => handleLike(item._id)}
            style={styles.likeButton}>
            <Text style={styles.likeText}>{item.likes.length} ❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleComment(item._id)}
            style={styles.commentButton}>
            <Text style={styles.commentText}>{item.comments.length} 💬</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#ff2d55" style={styles.loading} />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Our Community</Text>
          <TouchableOpacity onPress={handleAddPost} style={styles.plusButton}>
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
        </View>
        {posts.length == 0 ? (
          <View style={styles.noPostsContainer}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/1065/1065715.png',
              }}
              style={styles.noPostsImage}
            />
            <Text style={styles.noPostsText}>No posts yet</Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={item => item._id}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
            contentContainerStyle={styles.list}
            refreshing={loading}
            onRefresh={fetchPosts}
          />
        )}
      </View>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
        swipeDirection="down"
        onSwipeComplete={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Please Log In</Text>
          <Text style={styles.modalText}>
            You need to be logged in to like a post or create a new post
          </Text>
          <TouchableOpacity style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Go To Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalCancelButton}>
            <Text style={styles.modalCancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 4,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  plusButton: {
    backgroundColor: '#ff2d55',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  plusText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#ff2d55',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    paddingVertical: 10,
  },
  modalCancelButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  postContainer: {
    marginVertical: 12,
    backgroundColor: 'white',

    elevation: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  postInfo: {
    padding: 15,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff2d55',
    marginVertical: 8,
  },
  description: {fontSize: 15, color: '#666', lineHeight: 22},
  interaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  likeButton: {padding: 8},
  likeText: {fontSize: 15, color: '#ff2d55'},
  commentButton: {padding: 8},
  commentText: {fontSize: 15, color: '#007AFF'},
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
});
