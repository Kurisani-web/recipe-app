import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {useAppSelector} from '../store';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import Modal from 'react-native-modal';
import {Bar} from 'react-native-progress';
import axios from 'axios';

const AddPostScreen = () => {
  const {token} = useAppSelector(state => state.auth);
  const navigation = useNavigation();
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState(0);

  const openGallery = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (result?.assets?.[0]?.uri) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!recipeName || !photo || !description) {
      Alert.alert('Missing fields', 'please fill all fields');
      return;
    }
    if (!token) {
      Alert.alert('Authentication error', 'No valid token found');
      return;
    }

    setUploading(true);
    setUploadingProgress(0);

    const formData = new FormData();
    formData.append('recipeName', recipeName);
    formData.append('description', description);
    formData.append('image', {
      uri: photo,
      type: 'image/jpeg',
      name: `photo_${Date.now()}.jpg`,
    } as any);

    try {
      await axios.post('https://recipe-app-anzh.onrender.com/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadingProgress(percentCompleted);
        },
      });

      setUploadingProgress(100);

      await new Promise(resolve => setTimeout(resolve, 1000));

      navigation.goBack();
    } catch (error) {
      console.log('Error', error);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Create a Post</Text>
          <TouchableOpacity onPress={openGallery} style={styles.imagePicker}>
            {photo ? (
              <Image style={styles.imagePreview} source={{uri: photo}} />
            ) : (
              <Text style={styles.pickText}>Pick an Image</Text>
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={recipeName}
            onChangeText={setRecipeName}
            placeholder="Recipe Name"
            editable={!uploading}
            placeholderTextColor="#666"
          />

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            editable={!uploading}
            placeholderTextColor="#666"
            multiline
            editable={!uploading}
          />

          <TouchableOpacity
            onPress={handlePost}
            style={[styles.postButton, uploading && styles.postButtonDisabled]}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal isVisible={uploading} backdropOpacity={0.5} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Posting...</Text>
          <Bar
            progress={uploadingProgress / 100}
            width={200}
            height={10}
            color="#ff2d55"
            borderRadius={5}
            unfilledColor="#ddd"
            borderWidth={0}
          />
          <Text style={styles.progressText}>{uploadingProgress} %</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 15,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  imagePicker: {
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    resizeMode: 'cover',
  },
  pickText: {
    color: '#666',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  postButton: {
    backgroundColor: '#ff2d55',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  postButtonDisabled: {backgroundColor: '#ff6f81', opacity: 0.7},
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
});
