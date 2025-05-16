import {StyleSheet, Text, View,ScrollView, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import axios from 'axios';

type DishDetailParam = {
  DishDetail: {
    recipeId: number;
    title: string;
    image: string;
  };
};

interface RecipeDetail {
  id: number;
  title: string;
  image: string;
  extendedIngredients: {original: string}[];
  analyzedInstructions: {steps: {number: number; step: string}[]}[];
}

const DishDetailScreen = () => {
  const route = useRoute<RouteProp<DishDetailParam, 'DishDetail'>>();
  const {recipeId, title, image} = route.params;
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/${recipeId}/information`,
          {
            params: {
              apiKey: '025ac59df0de49b88c492a6eb2825748',
              includeNutrition: false,
            },
          },
        );
        setRecipe(response.data);
      } catch (error) {
        console.log('Error', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, []);
  return (
    <ScrollView style={styles.container}>
      <Image source={{uri:image}} style={styles.image}/>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe?.extendedIngredients?.map((ingredient:any,index:number) => (
              <Text style={styles.ingredient} key={index}>{ingredient.original}</Text>
          ))}
      </View>

      <View style={styles.section}>
          <Text style={styles.sectionTitle}>Steps</Text>
          {recipe?.analyzedInstructions[0]?.steps.map((step:any,index:number) => (
              <View style={styles.step}>
                  <Text style={styles.stepNumber}>Step {step.number}</Text>
                  <Text style={styles.stepText}>{step.step}</Text>
              </View>
          ))}
      </View>
      <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Start Cooking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DishDetailScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white"
    },
    image:{
        width:"100%",
        height:300,
        resizeMode:"cover"
    },
    title:{
        fontSize:25,
        fontWeight:"bold",
        textAlign:"center",
        marginVertical:20,
        color:"#333"
    },
    section:{
        padding:20
    },
    sectionTitle:{
        fontSize:22,
        fontWeight:"600",
        color:"#ff2d55",
        marginBottom:10
    },
    ingredient:{
        fontSize:16,
        color:"#666",
        marginBottom:5,
    },
    step:{
        marginBottom:15,
    },
    stepNumber:{
        fontSize:15,
        fontWeight:"bold",
        color:"#007AFF"
    },
    stepText:{
        fontSize:15,
        color:"#666"
    },
    startButton:{
        backgroundColor:"#ff2d55",
        padding:15,
        borderRadius:25,
        margin:20,
        alignItems:"center"
    },
    startButtonText:{
        color:"#fff",
        fontSize:16,
        fontWeight:"bold"
    }
});
