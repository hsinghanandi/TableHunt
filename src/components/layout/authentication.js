import React from 'react';
import * as Google from 'expo-google-app-auth'
import * as WebBrowser from 'expo-web-browser';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, } from 'react-native';
import { HStack, Button, VStack, Flex, Stack, Center, Divider, Link } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SvgUri from 'react-native-svg-uri'



const Authentication = ({ setAccessToken, setUserInfo, userInfo, accessToken }) => {

  const navigation = useNavigation();

  async function signInWithGoogleAsync() {

    try {
      const result = await Google.logInAsync({
        expoClientId: "32874219277-hu0dk0feqc5ovl3gjg6b4i2lieopbi6a.apps.googleusercontent.com",
        androidClientId: "32874219277-bhghnuaipathh4hs9s3kbmgvnmi6l9t7.apps.googleusercontent.com",
        iosClientId: "32874219277-9fngpuj5j8kfi47dl51qheis3r9btt15.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });

      if (result.type === "success") {
        setAccessToken(result.accessToken);
        navigation.navigate('HomePage', {
          accessToken: result.accessToken,
        })
      } else {
        console.log("Permission denied");
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function getUserData() {
    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })

    userInfoResponse.json().then(data => {
      setUserInfo(data);
    })
  }

  function showUserInfo() {
    if (userInfo) {
      return (
        <View style={styles.userInfo}>

          <Image source={{ uri: userInfo.picture }} style={styles.profilePic} />
          <Text>Welcome {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View>
      )
    }
  }
  return (

    <VStack >
      <Flex alignItems="center">
        <View style={styles.container}>
          {showUserInfo()}
          {/* <Heading style={styles.tableHunt} ml={'auto'} mr={'auto'} mt={'100px'}>Table Hunt</Heading> */}
          <Stack alignItems="center" style={styles.tableHunt} mt={'100px'} mb={'20'} >
            <SvgUri source={require('../assets/app_logo.svg')} />
          </Stack>
          <Text bold style={styles.subheading} noOfLines={3}>Find your seating in seconds for your next occasion</Text>
          <Text style={styles.subtitle}>You signup, We reserve. Quick!</Text>

          <Button style={styles.button} borderRadius={8} width='100%' mt='5' onPress={() => signInWithGoogleAsync()} alignItems='center'>
            <HStack space={2}>
              {/* <MaterialCommunityIcons name="google" size={26} color="green" /> */}
              <SvgUri source={require('../assets/google_logo.svg')} />
              <Center>
                <Text>{accessToken ? "Logging in..." : "SignUp with Google"}</Text>
              </Center>
            </HStack>
          </Button>

          <Divider m={'5'} thickness="1" />

          <Button style={styles.button_email} mt='0' height='50' onPress={() => accessToken ? getUserData : signInWithGoogleAsync} >Continue with email</Button>


          <Text >Not a member?<Link>Sign up</Link></Text>
          <StatusBar style="auto" />

          <Text>Are you a restaurant owner?</Text>
          {/* <Button height='50' borderRadius={8} width='50%' mt='5'>Continue with email</Button>
          <Button height='50' borderRadius={8} width='50%' mt='5' onPress={accessToken ? getUserData : signInWithGoogleAsync}>
            {accessToken ? "Get user data" : "Continue with google"}
          </Button> */}
        </View>
      </Flex>
    </VStack >

  )
}

export default Authentication

const styles = StyleSheet.create({
  container: {
    margin: 100,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
  },
  userInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: 50,
    height: 50
  },
  button: {
    borderRadius: 50,
    width: '100%',
  },
  tableHunt: {
    width: 164,
    height: 23,
    color: 'rgb(106,153,78)',
    textAlign: 'center',
    fontSize: 30,
  },
  subheading: {
    marginTop: 10,
    width: 300,
    height: 108,
    fontSize: 26,
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: 'rgb(20,17,15)'
  },
  subtitle: {
    marginTop: 20,
    width: 216,
    height: 21,
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: 'rgb(156,163,175)'
  },
  button: {
    width: 335,
    height: 48,
    borderRadius: 4,
    backgroundColor: 'rgb(255,255,255)',
    shadowColor: "rgba(156, 163, 175, 0.4)",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 12,
    shadowOpacity: 1
  },
  button_email: {
    width: 335,
    height: 48,
    borderRadius: 4,
    backgroundColor: '#924344',

  }
});

