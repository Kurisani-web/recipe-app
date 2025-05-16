/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './navigation/AppNavigator';
import { Provider, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { setUser, store } from './store';


const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try{
        const authData = await AsyncStorage.getItem("auth");
        if(authData){
          const {user,token} = JSON.parse(authData);
          const decoded:any = jwtDecode(token);
          const currentTime = Date.now()/ 1000;
          if(decoded.exp < currentTime){
            await AsyncStorage.removeItem("auth");
            return;
          }
          dispatch(setUser({user,token}))
        }
      }catch(error){
        console.log("Error",error);
        await AsyncStorage.removeItem("auth")
      }
    }
    initializeAuth()
  },[dispatch]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

function App():React.JSX.Element{
  return (
    <Provider store={store}>
      <AppContent/>
    </Provider>
  )
}

export default App;