import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const MealPlansScreen = () => {
  const navigation = useNavigation();
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const response = await axios.get(
          'https://api.spoonacular.com/recipes/complexSearch',
          {
            params: {
              apiKey: '025ac59df0de49b88c492a6eb2825748',
              number: 20,
              addRecipeInformation: true,
            },
          },
        );

        const recipes = response.data.results;

        const plans = [
          {
            name: 'Focus on Fiber',
            recipes: recipes.slice(0, 4).map((r: any) => ({
              id: r.id,
              title: r.title,
              image: r.image,
            })),
          },

          {
            name: 'Spring Holidays Made Simple',
            recipes: recipes.slice(4, 7).map((r: any) => ({
              id: r.id,
              title: r.title,
              image: r.image,
            })),
          },

          {
            name: 'One Pot No-Stress Cooking',
            recipes: recipes.slice(7, 11).map((r: any) => ({
              id: r.id,
              title: r.title,
              image: r.image,
            })),
          },

          {
            name: 'More Meal Plans',
            recipes: recipes.slice(11, 13).map((r: any) => ({
              id: r.id,
              title: r.title,
              image: r.image,
            })),
          },
        ];

        setMealPlans(plans);
      } catch (error) {
        console.log('Error', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlans();
  }, []);

  const handleMealPress = (
    planName: string,
    recipes: {id: number; title: string; image: string}[],
  ) => {
    navigation.navigate('MealPlanDetail', {planName, recipes});
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/1065/1065715.png',
          }}
          style={styles.headerImage}
        />
        <View style={styles.headerText}>
          <Text style={styles.unlockText}>Unlock all of Meal Plans</Text>
          <Text style={styles.subText}>
            Create your own plans and see the full library of Tasty plans with
            Tasty +
          </Text>
        </View>
      </View>
      <View style={styles.collageContainer}>
        <Image
          source={{
            uri: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1200',
          }}
          style={styles.collageImage}
        />
        <Image
          source={{
            uri: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1200',
          }}
          style={styles.collageImage}
        />
        <View style={styles.recipesBadge}>
          <Text style={styles.recipesBadgeText}>4 recipes</Text>
        </View>
      </View>

      <Text
        style={{
          fontSize: 26,
          fontWeight: 'bold',
          paddingHorizontal: 15,
          color: '#333',
          marginBottom: 15,
        }}>
        Tasty Meal Plans
      </Text>
      {mealPlans?.map((plan: any, index: number) => (
        <TouchableOpacity
          onPress={() => handleMealPress(plan.name, plan.recipes)}
          key={index}
          style={styles.planCard}>
          <Image
            style={styles.planImage}
            source={{uri: plan.recipes[0].image}}
          />

          <View style={styles.planInfo}>
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planCount}>{plan.recipes.length} recipes</Text>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>
          Start meal plan with these recipes
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MealPlansScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
  },
  headerImage: {
    width: 120,
    height: 120,
    borderRadius: 15,
    marginRight: 15,
  },
  headerText: {
    flex: 1,
    paddingRight: 10,
  },
  unlockText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  collageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    position: 'relative',
    marginBottom: 20,
  },
  collageImage: {
    width: '48%',
    height: 180,
    borderRadius: 15,
  },
  recipesBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ffd700',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  recipesBadgeText: {color: '#fff', fontWeight: 'bold', fontSize: 12},
  planCard: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 5,
    marginHorizontal: 15,
    alignItems: 'center',
  },
  planImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  planInfo: {
    flex: 1,
    marginLeft: 15,
    paddingRight: 10,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  planCount: {
    fontSize: 14,
    color: '#666',
  },
  startButton: {
    backgroundColor: '#ff2d55',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    margin: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
