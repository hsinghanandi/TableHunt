import { REACT_APP_API_KEY } from 'react-native-dotenv'
import { ScrollView, VStack, Heading } from 'native-base'
import React, { useEffect, useState } from 'react'
import GooglePlacesInput from '../forms/GooglePlacesInput'
import { Actionsheet, useDisclose, Box } from 'native-base'
import SearchPageSkeletonCard from '../listitems/SearchPageSkeletonCard'
import RestaurantCard from '../listitems/RestaurantCard'
import axios from 'axios'
import * as Location from 'expo-location'
import CuisinesStack from '../stacks/CuisinesStack'

const SearchScreenContainer = ({ navigation }) => {
  const { isOpen, onOpen, onClose } = useDisclose()
  const [restaurantType, setRestaurantType] = useState('punjabi')
  const [nearbyPlaces, setNearbyPlaces] = useState([])
  const [location, setLocation] = useState()
  const [isLoaded, setIsLoaded] = useState(false)

  const getLocation = async () => {
    try {
      setIsLoaded(false)
      const { granted } = await Location.requestForegroundPermissionsAsync()
      if (!granted) return
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync()
      setLocation({ latitude, longitude })
      setIsLoaded(true)
    } catch (error) {
      console.log(error)
    }
  }

  const getNearbyPlaces = async () => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=40000&type=restaurant&keyword=${restaurantType}&key=${REACT_APP_API_KEY}&maxprice=4&minprice=2&location=${
      location ? location.latitude : null
    }%2C${location ? location.longitude : null}`

    try {
      const request = await axios.get(url)
      setNearbyPlaces(request?.data?.results)
      setIsLoaded(true)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getLocation()
  }, [])

  useEffect(() => {
    // get Nearby Places
    setIsLoaded(false)
    getNearbyPlaces()
  }, [restaurantType])

  return (
    <VStack space={10} py={20} px={5}>
      <GooglePlacesInput
        searchRestaurant={'searchRestaurant'}
        navigation={navigation}
      />
      <Heading size='lg' mt='12' ml='5'>
        Cuisines
      </Heading>

      {/* loads Cuisines list layout */}
      <CuisinesStack onOpen={onOpen} setRestaurantType={setRestaurantType} />

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Box w='100%' h={60} px={4} justifyContent='center'>
            <Heading
              fontSize='20'
              color='gray.600'
              _dark={{
                color: 'gray.300',
              }}
            >
              {isLoaded
                ? `${restaurantType} Restaurants`
                : `Loading Restaurants...`}
            </Heading>
          </Box>

          {isLoaded ? (
            <ScrollView
              vertical={true}
              w={380}
              showsVerticalScrollIndicator={false}
            >
              <VStack space={2}>
                {nearbyPlaces.map((el, index) => (
                  <RestaurantCard
                    restaurant={el}
                    key={index}
                    navigation={navigation}
                    onClose={onClose}
                  />
                ))}
              </VStack>
            </ScrollView>
          ) : (
            <VStack space={2} w={380}>
              <SearchPageSkeletonCard />
              <SearchPageSkeletonCard />
              <SearchPageSkeletonCard />
              <SearchPageSkeletonCard />
            </VStack>
          )}
        </Actionsheet.Content>
      </Actionsheet>
    </VStack>
  )
}

export default SearchScreenContainer
