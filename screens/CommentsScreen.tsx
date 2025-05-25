import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAppSelector} from '../store';
import axios from 'axios';
import moment from 'moment';

const CommentsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const {postId} = route?.params;
  console.log('data value', postId);
  const {token} = useAppSelector(state => state.auth);
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postId) {
      fetchPostAndComments();
    }
  }, [postId]);

  const fetchPostAndComments = async () => {
    try {
      const postResponse = await axios.get(
        `/api/posts/${postId}`,
      );
      console.log('Response', postResponse);
      setPost(postResponse.data);

      const commentsResponse = await axios.get(
        `http://localhost:3000/api/posts/${postId}/comments`,
      );
      setComments(commentsResponse.data);
    } catch (error) {
      console.log('Error', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <ActivityIndicator size="large" color="#ff2d55" style={styles.loading} />
    );

  if (!post) return <Text style={styles.loading}>Post not found</Text>;
  const handleAddComment = async () => {
    if (!token) {
      navigation.navigate('Login');
      return;
    }

    if (newComment.trim()) {
      try {
        await axios.post(
          `http://localhost:3000/api/posts/${postId}/comments`,
          {
            text: newComment,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setNewComment('');
        fetchPostAndComments();
      } catch (error) {
        console.log('Error', error);
      }
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollContainer}>
        {/* Post Section */}
        <View style={styles.postContainer}>
          <Image
            source={{uri: `http://localhost:3000${post.imageUrl}`}}
            style={styles.postImage}
          />
          <View style={styles.postInfo}>
            <Text style={styles.username}>{post.userId.name}</Text>
            <Text style={styles.time}>{moment(post.createdAt).fromNow()}</Text>
            <Text style={styles.recipeName}>{post.recipeName}</Text>
            <Text
              style={styles.description}
              numberOfLines={3}
              ellipsizeMode="tail">
              {post.description}
            </Text>
            <View style={styles.interaction}>
              <Text style={styles.likeText}>{post.likes.length} ❤️</Text>
              <Text style={styles.commentText}>{post.comments.length} 💬</Text>
            </View>
          </View>
        </View>

        <Text style={styles.commentsHeader}>Comments</Text>
        {comments.length === 0 ? (
          <Text style={styles.noComments}>No comments yet for this post</Text>
        ) : (
          comments.map(comment => (
            <View key={comment._id} style={styles.commentItem}>
              <Text style={styles.commentUsername}>
                {comment.userId.name || 'Anonymous'}
              </Text>
              <Text style={styles.commentText}>{comment.text}</Text>
              <Text style={styles.commentTime}>
                {moment(comment.createdAt).fromNow()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Add a comment..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.postButton} onPress={handleAddComment}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CommentsScreen;

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#fff'},
  scrollContainer: {flex: 1, padding: 15, paddingTop: 10},
  postContainer: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 18,
    elevation: 6,
    overflow: 'hidden',
  },
  postImage: {width: '100%', height: 220, resizeMode: 'cover'},
  postInfo: {padding: 15},
  username: {fontSize: 16, fontWeight: '600', color: '#333'},
  time: {fontSize: 12, color: '#666', marginTop: 3},
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
  likeText: {fontSize: 15, color: '#ff2d55'},
  commentText: {fontSize: 15, color: '#007AFF'},
  commentsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  noComments: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  commentItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 2,
  },
  commentUsername: {fontSize: 16, fontWeight: '600', color: '#333'},
  commentText: {fontSize: 14, color: '#666', marginTop: 5},
  commentTime: {fontSize: 12, color: '#999', marginTop: 3},
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  postButton: {
    backgroundColor: '#ff2d55',
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  postButtonText: {color: '#fff', fontWeight: 'bold', fontSize: 14},
  loading: {textAlign: 'center', marginTop: 20, fontSize: 18, color: '#666'},
});
