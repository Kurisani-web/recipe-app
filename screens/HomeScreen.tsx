import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Icon from '@react-native-vector-icons/ionicons';

const HomeScreen = () => {
  interface Recipe {
    id: number;
    title: number;
    image: string;
    readyInMinutes: number;
    healthScore: number;
    type?: string;
  }
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          'https://api.spoonacular.com/recipes/complexSearch',
          {
            params: {
              apiKey: '025ac59df0de49b88c492a6eb2825748',
              cuisine: 'indian',
              number: 10,
              addRecipeInformation: true,
            },
          },
        );
        console.log('Data', response);
        const data = response.data.results.map((recipe: any) => ({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          readyInMinutes: recipe.readyInMinutes,
          healthScore: recipe.healthScore,
          type: Math.random() > 0.5 ? 'One-pot' : 'Easy',
        }));
        setRecipes(data);
      } catch (error) {
        console.log('Error', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);
  const renderRecipeCard = ({item}: {item: Recipe}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Detail', {
          recipeId: item?.id,
          title: item?.title,
          image: item?.image,
        })
      }
      activeOpacity={0.8}
      style={styles.card}>
      <Image source={{uri: item.image}} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.details}>
        {item.readyInMinutes} min • {Math.round(item.healthScore)}%
      </Text>
      <TouchableOpacity style={styles.bookmark}>
        <Text style={styles.bookmarkText}>Bookmark</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome to Cook with CheFu</Text>
        <Text style={styles.subtitle}>Delicious dishes waiting for you to try!</Text>
      </View>

      <FlatList
        data={recipes}
        renderItem={renderRecipeCard}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
      <Pressable
      onPress={() => navigation.navigate("Meal")}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 'auto',
          position: 'absolute',
          bottom: 35,
          right: 25,
          alignContent: 'center',
          backgroundColor:"#007AFF"
        }}>
        <Icon
          style={{textAlign: 'center'}}
          name="add"
          size={24}
          color="white"
        />
      </Pressable>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 55,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 150,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
  },
  row: {
    justifyContent: 'space-between',
  },
  typeBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#007AFF',
    padding: 5,
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
  },
  details: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  bookmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff2d55',
    padding: 5,
    borderRadius: 15,
  },
  bookmarkText: {
    color: 'white',
    fontSize: 12,
  },
});
