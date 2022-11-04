import { REACT_APP_API_KEY } from 'react-native-dotenv'
import {
  Center,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  ScrollView,
  Divider,
  Image,
  Box,
  FlatList,
  Flex,
} from 'native-base'
import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { StyleSheet, View } from 'react-native'
import { Rating } from 'react-native-ratings'
import { LoginContext } from '../context/LoginContext'
import CurrencyCircleDollar from '../assets/iconComponents/CurrencyCircleDollar'
import ForkKnife from '../assets/iconComponents/ForkKnifeIcon'
import LocationIcon from '../assets/iconComponents/LocationIcon'
import StarIcon from '../assets/iconComponents/StarIcon'
import { Linking } from 'react-native'
import { fetchCreateRestaurant } from '../../api'

const RestaurantContainer = ({ data, navigation }) => {
  const [
    accessToken,
    setAccessToken,
    userInfo,
    setUserInfo,
    userToken,
    setUserToken,
    userId,
    setUserId,
  ] = useContext(LoginContext)

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.item}>
        <Image
          source={{
            uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photo_reference}&key=${REACT_APP_API_KEY}`,
          }}
          containerStyle={styles.imageContainer}
          style={styles.image}
          alt='ok'
        />
      </View>
    )
  }

  // States for the info/reviews toggle
  const [info, setInfo] = useState(true)
  const [reviews, setReviews] = useState(false)
  const [details, setDetails] = useState()

  // state for photos carousel
  const [photos, setPhotos] = useState([])
  const [restaurantDetails, setRestaurantDetails] = useState({})

  const createRestaurant = async () => {
    try {
      const res = await fetchCreateRestaurant(restaurantDetails, userToken)
      if (res?.data?.status == 'AUTH FAILED') logoutUser()
      else {
        console.log(res.data.message)
      }
    } catch (error) {
      console.log('Error in creating restaurant', error)
    }
  }

  useEffect(() => {
    setRestaurantDetails({
      name: restaurant.name,
      vicinity: restaurant.vicinity,
      rating: restaurant.rating,
      place_id: restaurant.place_id,
      phoneNumber: details?.formatted_phone_number || 'Not Available',
      lat: restaurant.geometry.location.lat,
      lng: restaurant.geometry.location.lng,
    })
  }, [photos])

  const restaurant = data.restaurant
  const priceLevel = restaurant?.price_level
  let priceRating

  const placeID = restaurant?.place_id
  const placeDetailsURL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&key=${REACT_APP_API_KEY}`

  // Call the place details API
  const getPlaceDetails = () => {
    axios
      .get(placeDetailsURL)
      .then((result) => {
        setDetails(result?.data?.result)
        setPhotos(result?.data?.result?.photos)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    getPlaceDetails()
  }, [])
  switch (priceLevel) {
    case 1:
      priceRating = `$5-$10`
      break
    case 2:
      priceRating = `$11-$20`
      break
    case 3:
      priceRating = `$21-$30`
      break
    case 4:
      priceRating = `$31+`
      break
    default:
      priceRating = 'Not Available'
  }

  // Show todays opening_hours
  const dayOfWeekName = new Date().toLocaleString('default', {
    weekday: 'long',
  })

  return (
    <View>
      <ScrollView bgColor='#ffffff'>
        {photos != [] && (
          <FlatList
            data={photos}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            onSnapToItem={(index) => setActiveSlide(index)}
          />
        )}

        <VStack space={0} py={1} px={1}>
          <HStack p={6} pb={3}>
            <Heading size='xl' mr='60px'>
              {restaurant.name}
            </Heading>
            <Button size='sm' mr={-2} ml={'auto'} style={styles.button}>
              <HStack>
                <StarIcon color='white' />
                <Text color='white' fontSize={14} ml={2} mr={2}>
                  {restaurant.rating}
                </Text>
              </HStack>
            </Button>
          </HStack>
          <Divider />
          <HStack space={20} pt={5} pl={8}>
            <HStack>
              <ForkKnife />
              <Text ml='2'>Multiple</Text>
            </HStack>
            <HStack ml={10}>
              <CurrencyCircleDollar />
              <Text ml='2'>{priceRating}</Text>
            </HStack>
          </HStack>
          <HStack pt={2} pl={8} mb={2}>
            <LocationIcon />
            <Text ml='2'>{restaurant.vicinity}</Text>
          </HStack>
          <Divider />

          <HStack mt={4}>
            <View style={info && styles.under}>
              <Text
                mb={4}
                style={info ? styles.selected : styles.unselected}
                onPress={() => {
                  setInfo(true)
                  setReviews(false)
                }}
                mr={20}
                fontSize='lg'
                ml={20}
              >
                Info
              </Text>
            </View>
            <View style={reviews && styles.under}>
              <Text
                style={reviews ? styles.selected : styles.unselected}
                fontSize='lg'
                mr={20}
                ml={12}
                mb={2}
                onPress={() => {
                  setInfo(false)
                  setReviews(true)
                }}
              >
                Reviews
              </Text>
            </View>
          </HStack>

          {info && (
            <VStack ml={5} mr={5} mt={8}>
              <Text style={styles.heading}>Opening hours</Text>
              {details?.opening_hours.weekday_text.map((el, index) => (
                <Text
                  style={
                    el.includes(dayOfWeekName)
                      ? styles.highlighted
                      : styles.unselected
                  }
                  fontSize={14}
                  key={index}
                >
                  {el}
                </Text>
              ))}
              <Text
                onPress={() =>
                  Linking.openURL(`tel:${details?.formatted_phone_number}`)
                }
                mt={6}
                mb={16}
                fontSize={16}
              >
                <Text style={styles.heading}>Phone: </Text>
                <Text fontWeight='bold' color='rgba(188, 71, 73, 1)'>
                  {details?.formatted_phone_number || 'Not Available'}
                </Text>
              </Text>
            </VStack>
          )}
          <Center pt={10}>.</Center>
          {reviews && (
            <VStack ml={5} mr={5} mt={-8} mb={20}>
              <Text style={styles.heading}>
                {restaurant?.user_ratings_total} Reviews{' '}
              </Text>
              {details?.reviews
                .sort((a, b) => b.time - a.time)
                .map((el, index) => (
                  <Box mt={5} key={index}>
                    <HStack>
                      <Image
                        source={{
                          uri: el.profile_photo_url,
                        }}
                        alt={el.author_name}
                        height={50}
                        width={50}
                      />
                      <VStack>
                        <Text style={styles.name} key={index}>
                          {el.author_name}
                        </Text>
                        <HStack>
                          <Rating
                            style={{ marginLeft: 10, marginTop: 2 }}
                            type='star'
                            ratingCount={5}
                            imageSize={15}
                            startingValue={el.rating}
                            readonly='true'
                            ratingBackgroundColor='black'
                          />
                          <Text style={styles.time}>
                            {el.relative_time_description}
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>
                    <Text mb={2} mt={4} fontSize={14}>
                      {el.text}
                    </Text>
                    <Divider />
                  </Box>
                ))}
            </VStack>
          )}
        </VStack>
      </ScrollView>

      <Button
        position='absolute'
        bottom={5}
        left={5}
        mt={5}
        mb={2}
        m='auto'
        width='90%'
        zIndex={1}
        bgColor={'rgba(188, 71, 73, 1)'}
        onPress={() => {
          navigation.navigate('Booking Page', { restaurantDetails })
          createRestaurant()
        }}
        size='12'
      >
        Book
      </Button>
    </View>
  )
}

export default RestaurantContainer

const styles = StyleSheet.create({
  heading: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
    marginTop: 4,
  },
  time: {
    marginLeft: 120,
    fontSize: 12,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 1,
  },
  selected: {
    fontWeight: 'bold',
    borderColor: 'black',
    // borderWidth: 2,
  },
  unselected: {
    fontWeight: '300',
  },
  highlighted: {
    fontWeight: 'bold',
    color: 'rgba(188, 71, 73, 1)',
    fontSize: 16,
  },
  under: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
  button: {
    backgroundColor: 'rgba(106, 153, 78, 1)',
    borderRadius: 30,
    height: 40,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
})
