import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { logout, useAppSelector } from '../store';
import { useDispatch } from 'react-redux';

const ProfileScreen = () => {
  const {user,token} = useAppSelector(state => state.auth)
  const navigation = useNavigation();
  const dispatch = useDispatch();

  if(user){
    return(
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.profileText}>Profile : {user?.email}</Text>
          <Text style={styles.subText}>Name: {user?.name}</Text>

          <TouchableOpacity onPress={() => dispatch(logout())} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/9481/9481394.png',
          }}
          style={styles.emoji}
        />

        <Text style={styles.title}>
          Log in or create an account to save your favourite recipes
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.signInButton}>
          <Text style={styles.signText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By signing up, you are agreeing to our <Text style={styles.link}>User Agreement</Text> and
          <Text style={styles.link}> Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea:{
    flex:1,
    backgroundColor:"white"
  },
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    padding:20
  },
  emoji:{
    width:100,
    height:100,
    marginBottom:20
  },
  title:{
    fontSize:20,
    fontWeight:"bold",
    color:"#333",
    textAlign:"center",
    marginBottom:30,
    lineHeight:26
  },
  signInButton:{
    backgroundColor:"#ff2d55",
    paddingVertical:12,
    paddingHorizontal:40,
    borderRadius:25,
    marginBottom:15
  },
  signText:{
    color:"white",
    fontSize:17,
    textAlign:"center",
    fontWeight:"bold"
  },
  terms:{
    fontSize:12,
    color:"#666",
    textAlign:"center",
    lineHeight:18
  },
  link:{
    color:"#ff2d55",
    fontWeight:"600"
  },
  profileText:{
    fontSize:22,
    fontWeight:"bold",
    color:"#333",
    textAlign:"center",
    marginBottom:10
  },
  subText:{
    fontSize:16,
    color:"#666",
    textAlign:"center",
    marginBottom:20
  },
  logoutButton:{
    backgroundColor:"#007AFF",
    paddingVertical:10,
    paddingHorizontal:30,
    borderRadius:20
  },
  logoutText:{
    color:"white",
    textAlign:"center",
    fontSize:16,
    fontWeight:"bold"
  }
});
