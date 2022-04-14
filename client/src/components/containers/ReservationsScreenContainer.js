import React, { useState, useEffect, useContext } from 'react'
import BookingCard from '../listitems/BookingCard'
import { Heading, Center, Text, HStack, ScrollView, VStack, Spinner, Box } from "native-base"
import { LoginContext } from '../context/LoginContext'
import { fetchReservations } from '../../api'

const ReservationsScreenContainer = ({ navigation, data }) => {
    const [accessToken, setAccessToken, userInfo, setUserInfo, userToken, setUserToken, userId, setUserId] = useContext(LoginContext)
    const [bookings, setBookings] = useState()
    const [isLoaded, setIsLoaded] = useState(false)

    const getAllReservations = async () => {
        try {
            const res = await fetchReservations(userId, userToken);
            if (res?.data?.status == 'AUTH FAILED')
                logoutUser()
            else {
                setBookings(res.data.data);
                setIsLoaded(true)
            }
        }
        catch (error) {
            console.log("error in fetching user reservations", error)
        }
    }

    useEffect(() => {
        navigation.addListener('focus', () => {
            setIsLoaded(false);
            getAllReservations();
        });
    }, [navigation])

    return (
        <VStack bgColor="white" height="100%" >
            <Heading size="lg" mt="20" ml="6">
                Your Reservations
            </Heading>
            <Text fontSize={18} fontWeight="bold" color="gray.500" ml="7" mt="5" mb={2}>Upcoming</Text>

            {isLoaded ?
                <ScrollView vertical={true} w={380}
                    showsVerticalScrollIndicator={false}>
                    <VStack space={2} mb={4} display="flex" alignItems="center" justifyContent="center">
                        {bookings.length > 0
                            ? bookings.sort((a, b) => a.time - b.time).map((el, index) => (
                                <Box shadow={5} rounded="lg" w="88%" ml="2" key={index} >
                                    <BookingCard data={el} key={index} getAllReservations={getAllReservations} userToken={userToken} />
                                </Box>
                            ))
                            : <Center fontSize={14} mt={250}>No Reservations</Center>}
                    </VStack>
                </ScrollView>
                :
                <HStack space={2} justifyContent="center">
                    <Spinner color="danger.300" accessibilityLabel="Loading cards" />
                    <Heading color="danger.300" fontSize="md">
                        Refreshing
                    </Heading>
                </HStack>
            }
        </VStack>
    );
};

export default ReservationsScreenContainer;
