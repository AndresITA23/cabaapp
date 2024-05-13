import { Center, ButtonText, ButtonGroup, Icon, AddIcon, InfoIcon, ButtonSpinner, ArrowUpIcon, HStack, ThreeDotsIcon, Input, InputField, Avatar, Link, AvatarFallbackText } from '@gluestack-ui/themed';
import { AvatarImage, TextareaInput, Box, Text, ButtonIcon, Button, ChevronLeftIcon, FavouriteIcon, Image, ShareIcon, Heading, View, ScrollView, VStack, Textarea } from "@gluestack-ui/themed";
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from "react";
import { doc, onSnapshot, collection, query, where, orderBy, getDoc } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from '../utils';
import MapView, { Marker } from "react-native-maps";
import { Rating, AirbnbRating } from 'react-native-ratings';
import Carousel from "pinar";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Clock, MapPinned, SendHorizonal } from 'lucide-react-native';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import openMap from 'react-native-open-maps'

const styles = StyleSheet.create({
  slide1: {
    height: 360,
    width: 390,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a3c9a8"
  },
  text: {
    color: "#1f2d3d",
    opacity: 0.7,
    fontSize: 48,
    fontWeight: "bold"
  }
});

const Publication = (props) => {
  const { route } = props;

  const [publication, setPublication] = useState(null);
  const [userAvatarUrl, setUserAvatarUrl] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const isButtonDisabled = rating === 0 || comment.trim() === "";

  const handleRatingChange = (ratingValue: number) => {
    setRating(ratingValue);
  };

  const handleCommentChange = (text: string) => {
    setComment(text);
  };

  const handleSubmit = () => {
    // Aquí puedes agregar lógica para enviar el comentario
  };



  const openAppMap = () => {
    openMap({
      latitude: publication.location.latitude,
      longitude: publication.location.longitude,
      zoom: 19,
      query: publication.name,

    })
  }

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        setPublication(null);
        const docSnap = await getDoc(doc(db, "places", route.params.id));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPublication(data);


          if (data.userId) {
            const storage = getStorage();
            const userId = data.userId;

            const avatarRef = ref(storage, `avatar/${userId}`);
            const url = await getDownloadURL(avatarRef);
            setUserAvatarUrl(url);
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchPublication();
  }, [route.params.id]);

  if (!publication) return null;

  console.log(route.params);

  const navigation = useNavigation();

  return (
    <VStack flex={1} bg="#d6d6d6">
      <ScrollView>
        {/* Image/return/like/share */}
        <Box h={360} w={390}>
          <Carousel
            dotStyle={{
              width: 10,
              height: 10,
              backgroundColor: "#DDDDDD",
              maxWidth: 10,
              marginVertical: 20,
              marginHorizontal: 5,
              borderRadius: 100,
              
            }}
            activeDotStyle={{
              width: 10,
              height: 10,
              backgroundColor: "#FFFFFF",
              borderRadius: 10,
              marginHorizontal: 5,
              
            }}
          >
            {publication.images.map((image, index) => (
              <View key={index} style={styles.slide1}>
                <Image
                  source={{ uri: image }}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            ))}
          </Carousel>

          <Button
            w={50}
            h={50}
            position="absolute"
            left={16}
            borderRadius={999}
            bgColor="white"
            my={"$12"}
            onPress={() => navigation.goBack()}
          >
            <ButtonIcon as={ChevronLeftIcon} color="black" />
          </Button>

          <Button
            w={50}
            h={50}
            position="absolute"
            right={16}
            borderRadius={999}
            bgColor="white"
            my={"$12"}
          >
            <ButtonIcon as={FavouriteIcon} color="black" />
          </Button>

          <Button
            w={50}
            h={50}
            position="absolute"
            right={80}
            borderRadius={999}
            bgColor="white"
            my={"$12"}
          >
            <ButtonIcon as={ShareIcon} color="black" />
          </Button>
        </Box>

        {/* Main content  */}
        <Box
          borderTopLeftRadius={30}
          borderTopRightRadius={30}
          backgroundColor="#FEFEFE"
          position="relative"
          top={-22}
        >
          {/* Header/Stars */}
          <Box mx={16} marginVertical={16} flexDirection="row">
            <Heading fontSize={26} fontWeight="$semibold" color="#000000">
              {publication.name}
            </Heading>
            <Image
              w={100}
              h={20}
              top={6}
              position="absolute"
              right={0}
              source={require("../../assets/Stars.png")}
            />
          </Box>

          {/* IconLocation/TextLink */}
          <Box mx={16} marginTop={-6} flexDirection="row" alignItems="center">
            <MapPinned size={30} color="#BFA27E" />
            <Text ml={2} fontWeight="$light" fontSize={14}>
              {" "}
              {publication.address}
            </Text>
            <Text position="absolute" right={0} color="#1A91FF">
              (X Reviews)
            </Text>
          </Box>

          {/* ImageProp/NameProp/Range/TimeRange */}
          <Box mx={16} my={16} flexDirection="row">
            {userAvatarUrl ? (
              <Avatar bgColor="#BFA27E" size="lg">
                <AvatarImage
                  source={{ uri: userAvatarUrl }}
                />
              </Avatar>
            ) : (
              <Avatar bgColor="#BFA27E" size="xl">
                <AvatarFallbackText>AA</AvatarFallbackText>
              </Avatar>
            )}
            <Box ml={10} alignItems='center' justifyContent='center'>
              <Text fontSize={20} color="black" fontWeight="$semibold">
                Propietario: UserExample
              </Text>
            </Box>
          </Box>

          {/* Description/TextDescription */}
          <Box mx={16} my={16} marginTop={0}>
            <Text color="#000000" fontSize={20} fontWeight="$semibold">
              Description
            </Text>
            <Text marginTop={10} fontSize={15} fontWeight="$light">
              {publication.description}
            </Text>
          </Box>

          {/* Contact */}
          <Box mx={16} my={16} marginTop={0}>
            <Text color="#000000" fontSize={20} fontWeight="$semibold">
              Contact
            </Text>
            <Box marginTop={10}>
              <Box flexDirection='row' alignItems='center'>
                <Entypo name="email" size={20} color="#BFA27E" />
                <Text pl={5} fontSize={16} fontWeight="$medium">
                  {publication.email}
                </Text>
              </Box>

              <Box my={10} flexDirection='row' alignItems='center'>
                <FontAwesome name="whatsapp" size={20} color="#BFA27E" />
                <Text pl={5} fontSize={16} fontWeight="$medium">
                  {publication.phone}
                </Text>
              </Box>
            </Box>

          </Box>

          {/* Facilities/Icons/Text */}
          <Box mx={16} my={16} marginTop={0}>
            <Text color="#000000" fontSize={18} fontWeight="$semibold">
              Facilities
            </Text>

            <ScrollView horizontal={true}>
              <HStack my={10} justifyContent="space-between">
                <Box w={84} h={60} alignItems="center">
                  <Image
                    marginTop={0}
                    w={40}
                    h={40}
                    source={require("../../assets/Pool.png")}
                  />
                  <Text
                    h={20}
                    color="#BFA27E"
                    fontSize={14}
                    fontWeight="$semibold"
                  >
                    Pool
                  </Text>
                </Box>

                <Box w={84} h={60} alignItems="center">
                  <Image
                    marginTop={0}
                    w={40}
                    h={40}
                    source={require("../../assets/Sofa.png")}
                  />
                  <Text
                    h={20}
                    color="#BFA27E"
                    fontSize={14}
                    fontWeight="$semibold"
                  >
                    Furniture
                  </Text>
                </Box>

                <Box w={84} h={60} alignItems="center">
                  <Image
                    marginTop={0}
                    w={40}
                    h={40}
                    source={require("../../assets/Bathtub.png")}
                  />
                  <Text
                    h={20}
                    color="#BFA27E"
                    fontSize={14}
                    fontWeight="$semibold"
                  >
                    Bathroom
                  </Text>
                </Box>
                <Box w={84} h={60} alignItems="center">
                  <Image
                    marginTop={0}
                    w={40}
                    h={40}
                    source={require("../../assets/Weber.png")}
                  />
                  <Text
                    h={20}
                    color="#BFA27E"
                    fontSize={14}
                    fontWeight="$semibold"
                  >
                    Weber
                  </Text>
                </Box>
                <Box w={84} h={60} alignItems="center">
                  <Image
                    marginTop={0}
                    w={40}
                    h={40}
                    source={require("../../assets/Pool.png")}
                  />
                  <Text
                    h={20}
                    color="#BFA27E"
                    fontSize={14}
                    fontWeight="$semibold"
                  >
                    Pool
                  </Text>
                </Box>

                <Box w={84} h={60} alignItems="center">
                  <Image
                    marginTop={0}
                    w={40}
                    h={40}
                    source={require("../../assets/Sofa.png")}
                  />
                  <Text
                    h={20}
                    color="#BFA27E"
                    fontSize={14}
                    fontWeight="$semibold"
                  >
                    Furniture
                  </Text>
                </Box>

                <Box w={84} h={60} alignItems="center">
                  <Image
                    marginTop={0}
                    w={40}
                    h={40}
                    source={require("../../assets/Bathtub.png")}
                  />
                  <Text
                    h={20}
                    color="#BFA27E"
                    fontSize={14}
                    fontWeight="$semibold"
                  >
                    Bathroom
                  </Text>
                </Box>
                <Box w={84} h={60} alignItems="center">
                  <Image
                    marginTop={0}
                    w={40}
                    h={40}
                    source={require("../../assets/Weber.png")}
                  />
                  <Text
                    h={20}
                    color="#BFA27E"
                    fontSize={14}
                    fontWeight="$semibold"
                  >
                    Weber
                  </Text>
                </Box>
              </HStack>
            </ScrollView>
          </Box>

          {/* Location/Map */}
          <Box mx={16} my={16} marginTop={0}>
            <Text color="#000000" fontSize={18} fontWeight="$semibold">
              Location
            </Text>
            <Box marginTop={10}>
              <MapView
                onPress={openAppMap}
                style={{ width: "100%", height: 300, borderRadius: 20 }}
                initialRegion={{
                  latitude: publication.location.latitude,
                  longitude: publication.location.longitude,
                  latitudeDelta: publication.location.latitudeDelta,
                  longitudeDelta: publication.location.longitudeDelta,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: publication.location.latitude,
                    longitude: publication.location.longitude,
                  }}
                />
              </MapView>
            </Box>
          </Box>

          {/* Schedules */}
          <Box mx={16} my={16} marginTop={0}>
            <Text color="#000000" fontSize={18} fontWeight="$semibold">
              Schedules
            </Text>
            <Box flexDirection="row" marginTop={10} alignItems="center">
              <Clock size={24} color="#BFA27E" />
              <Text ml={5} fontSize={16}>
                24 Horas (10:00am - 10:00am){" "}
              </Text>
            </Box>
          </Box>

          {/* Rating */}
          <Box mx={16} my={16} marginTop={0}>
            <Text color="#333333" fontSize={18} fontWeight="$semibold">Rating</Text>
            <Box marginTop={10}>
              <Text fontWeight="$bold" color="#EBC351" size="4xl">5.0</Text>
              <Image w={100} h={20} top={5} source={require('../../assets/Stars.png')} />
            </Box>
          </Box>

          {/* Write your comment */}
          <Box mx={16} my={16} >
            <Text color="#333333" fontSize={18} fontWeight="$semibold" >Write your opinion</Text>
            <AirbnbRating reviews={["1", "2", "3", "4", "5"]} count={5} defaultRating={0} size={30}
              onFinishRating={handleRatingChange} />

            <Textarea borderRadius={10} marginTop={16} isReadOnly={false} isInvalid={true} isDisabled={false}>
              <TextareaInput placeholder="Write your opinion..."
                value={comment}
                onChangeText={handleCommentChange} />
            </Textarea>

            <Box mt={16}>
              <Box position="absolute" right={0}>
                <TouchableOpacity style={{ borderRadius: 20, padding: 10, paddingHorizontal: 16, flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: isButtonDisabled ? 'rgba(191, 162, 126, 0.5)' : '#BFA27E' }}
                  onPress={handleSubmit}
                  disabled={isButtonDisabled}>
                  <Text pr={6} fontSize={18} fontWeight="$medium" color='white'>Send</Text>
                  <SendHorizonal color="white" size={18}></SendHorizonal>
                </TouchableOpacity>
              </Box>
            </Box>
          </Box>

          {/* Coments */}
          <Box mx={16} my={16} mt={32}>
            <Text color="#000000" fontSize={18} fontWeight="$semibold">Coments</Text>
            <Box marginTop={15}>
              <Box flexDirection='row' justifyContent='space-between'>
                <Image w={90} h={16} source={require('../../assets/Stars.png')}></Image>
                <Text fontWeight='$light' size='sm'>22 mar. 2024</Text>
              </Box>
              <Text marginTop={5} fontSize={15} fontWeight='$light'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</Text>
              <Text fontSize={14} fontWeight='$light' marginTop={5}>UserExample</Text>
            </Box>
            <Box marginTop={16}>
              <Box flexDirection='row' justifyContent='space-between'>
                <Image w={90} h={16} source={require('../../assets/Stars.png')}></Image>
                <Text fontWeight='$light' size='sm'>22 mar. 2024</Text>
              </Box>
              <Text marginTop={5} fontSize={15} fontWeight='$light'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</Text>
              <Text fontSize={14} fontWeight='$light' marginTop={5}>UserExample</Text>
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </VStack>
  );
};

export default Publication;