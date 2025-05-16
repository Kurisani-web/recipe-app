import {StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';

type MealPlanDetailParams = {
  MealPlanDetail: {
    planName: string;
    recipes: {id: number; title: string; image: string}[];
  };
};

const MealPlanDetailScreen = () => {
  const route = useRoute<RouteProp<MealPlanDetailParams, 'MealPlanDetail'>>();
  const {planName, recipes} = route?.params;

  const quotes = {
    'Lentil Soup': 'A warm hug in a bowl, perfect for a cozy day.',
    'Quinoa Salad': 'Light and fresh, a burst of health in every bite.',
    'Broccoli Stir-Fry': 'Green goodness that dances on your palate.',
    'Chickpea Curry': 'Spicy comfort that warms the soul.',
    'Roasted Veggies': 'Roasted to perfection, a veggie lover’s dream.',
    'Herb Soup': 'Herbs sing in this soothing, aromatic broth.',
    'Spring Salad': 'A crisp celebration of spring’s finest flavors.',
    'Chicken Stew': 'Hearty and rich, a one-pot wonder.',
    'Beef Chili': 'Bold and spicy, a crowd-pleaser every time.',
    'Veggie Pasta': 'A colorful twist on a classic comfort dish.',
    'Rice Pilaf': 'Fluffy and fragrant, a side that steals the show.',
    'Fish Tacos': 'Ocean-fresh with a zesty kick.',
    'Mushroom Risotto': 'Creamy and earthy, a gourmet delight.',
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerSpacer} />
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.planTitle}>
        {planName}
      </Text>
      {recipes?.map((recipe: any) => (
        <View key={recipe.id} style={styles.recipeCard}>
          <Image style={styles.recipeImage} source={{uri: recipe.image}} />

          <View style={styles.recipeInfo}>
            <Text style={styles.recipeTitle}>{recipe?.title}</Text>
            <Text
              style={styles.recipeQuote}
              numberOfLines={2}
              ellipsizeMode="tail">
              {quotes[recipe.title] || 'A delicious treat awaits!'}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default MealPlanDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  headerSpacer: {
    height: 40,
  },
  planTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
    paddingHorizontal: 15,
  },
  recipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 5,
    marginHorizontal: 15,
  },
  recipeImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  recipeInfo: {
    flex: 1,
    marginLeft: 15,
    paddingRight: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  recipeQuote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
});
