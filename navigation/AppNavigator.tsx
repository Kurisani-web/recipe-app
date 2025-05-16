import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import MealPlansScreen from '../screens/MealPlansScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {RouteProp} from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ionicons';
import DishDetailScreen from '../screens/DishDetailScreen';
import MealPlanDetailScreen from '../screens/MealPlanDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import AddPostScreen from '../screens/AddPostScreen';
import CommentsScreen from '../screens/CommentsScreen';
import MealQueryScreen from '../screens/MealQueryScreen';

type TabParamList = {
  Discover: undefined;
  Community: undefined;
  MealPlans: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator();
const DiscoverStack = createNativeStackNavigator();
const MealPlanStack = createNativeStackNavigator();
const CommunityStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const DiscoverStackScreen = () => (
  <DiscoverStack.Navigator screenOptions={{headerShown: false}}>
    <DiscoverStack.Screen name="Home" component={HomeScreen} />
    <DiscoverStack.Screen name="Detail" component={DishDetailScreen} />
    <MealPlanStack.Screen name="Meal" component={MealQueryScreen} />
  </DiscoverStack.Navigator>
);

const MealPlanStackScreen = () => (
  <MealPlanStack.Navigator screenOptions={{headerShown: false}}>
    <MealPlanStack.Screen name="MealPlans" component={MealPlansScreen} />
    <MealPlanStack.Screen
      name="MealPlanDetail"
      component={MealPlanDetailScreen}
    />
  </MealPlanStack.Navigator>
);

const CommunityStackScreen = () => (
  <CommunityStack.Navigator screenOptions={{headerShown: false}}>
    <CommunityStack.Screen name="Community" component={CommunityScreen} />
    <CommunityStack.Screen name="AddPost" component={AddPostScreen} />
    <CommunityStack.Screen name="Comment" component={CommentsScreen} />
  </CommunityStack.Navigator>
);

const AuthStackScreen = () => (
  <AuthStack.Navigator screenOptions={{headerShown: false}}>
    <AuthStack.Screen name="Profile" component={ProfileScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
  </AuthStack.Navigator>
);

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }: {
        route: RouteProp<TabParamList, keyof TabParamList>;
      }) => {
        const getIconName = (routeName: String, focused: boolean) => {
          if (routeName == 'Discover') {
            return focused ? 'search' : 'search-outline';
          } else if (routeName == 'Community') {
            return focused ? 'people' : 'people-outline';
          } else if (routeName == 'MealPlans') {
            return focused ? 'calendar' : 'calendar-outline';
          } else if (routeName == 'Profile') {
            return focused ? 'person' : 'person-outline';
          }
          return 'help';
        };

        const options: BottomTabNavigationOptions = {
          tabBarIcon: ({
            focused,
            color,
            size,
          }: {
            focused: boolean;
            color: string;
            size: number;
          }) => {
            const iconName = getIconName(route.name, focused);
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#666',
          headerShown: false,
        };

        return options;
      }}>
      <Tab.Screen name="Discover" component={DiscoverStackScreen} />
      <Tab.Screen name="Community" component={CommunityStackScreen} />
      <Tab.Screen name="MealPlans" component={MealPlanStackScreen} />
      <Tab.Screen name="Profile" component={AuthStackScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({});
