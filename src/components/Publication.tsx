import {HStack,Avatar,AvatarFallbackText,} from "@gluestack-ui/themed";
import {AvatarImage,TextareaInput,Box,Text,ButtonIcon,Button,ChevronLeftIcon,FavouriteIcon,Image,ShareIcon,Heading,View,ScrollView,
  VStack,
  Textarea,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { db } from "../utils";
import MapView, { Marker } from "react-native-maps";
import { Rating, AirbnbRating } from "react-native-ratings";
import Carousel from "pinar";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Clock, MapPinned } from "lucide-react-native";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import openMap from "react-native-open-maps";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./ReviewPlace.data";
import Toast from "react-native-toast-message";
import { v4 as uuid } from "uuid";
import { map, mean } from "lodash";
import { SendHorizonal } from "lucide-react-native";
import {DateTime} from 'luxon';
import "intl";
import "intl/locale-data/jsonp/es";
import { Linking } from 'react-native';
import BtnFavorite from "./BtnFavorite";
import BtnReservation from "./BtnReservation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const styles = StyleSheet.create({
  slide1: {
    height: 360,
    width: 390,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a3c9a8",
  },
  text: {
    color: "#1f2d3d",
    opacity: 0.7,
    fontSize: 48,
    fontWeight: "bold",
  },
});

const Publication = (props) => {

  const auth = getAuth();

  const handleWhatsAppPress = () => {
    const formattedPhoneNumber = publication.phone.replace(/\s+/g, '');
    const message = encodeURIComponent('Hola, me interesa rentar su lugar');
    const whatsappLink = `whatsapp://send?phone=${formattedPhoneNumber}&text=${message}`;

    Linking.openURL(whatsappLink).catch(error =>
      console.error('Error al abrir el enlace de WhatsApp:', error)
    );
  };

  const { route } = props;
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "reviews"),
      where("idPlace", "==", route.params.id),
      orderBy("createdAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs);
    });
  }, []);


  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const auth = getAuth();
        const idDoc = uuid();
        const newData = formValue;
        newData.id = idDoc;
        newData.idPlace = route.params.id;
        newData.idUser = auth.currentUser.uid;
        newData.avatar = auth.currentUser?.photoURL;
        newData.createdAt = new Date();

        console.log(newData);
        await setDoc(doc(db, "reviews", idDoc), newData);
        await updatePlace();
        Toast.show({
          type: "success",
          position: "bottom",
          text1: "Review successfully submitted",
        });
      } catch (error) {
        console.log(error);
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Failed to send the review",
        });
      }
    },
  });

  const updatePlace = async () => {
    const q = query(
      collection(db, "reviews"),
      where("idPlace", "==", route.params.id)
    );

    onSnapshot(q, async (snapshot) => {
      const reviews = snapshot.docs;
      const arrayStars = map(reviews, (review) => review.data().rating);

      const media = mean(arrayStars);

      const placeRef = doc(db, "places", route.params.id);

      await updateDoc(placeRef, {
        ratingMedia: media,
      });
    });
  };

  const [publication, setPublication] = useState(null);
  const [userAvatarUrl, setUserAvatarUrl] = useState(null);

  const openAppMap = () => {
    openMap({
      latitude: publication.location.latitude,
      longitude: publication.location.longitude,
      zoom: 19,
      query: publication.name,
    });
  };

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

  const navigation = useNavigation();

  return (
    
    <VStack flex={1}>
      <KeyboardAwareScrollView>
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
                  alt="image of the place"
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
          
          <BtnFavorite idPlace={publication.id}></BtnFavorite>


        </Box>

        {/* Main content  */}
        <Box
          borderTopLeftRadius={30}
          borderTopRightRadius={30}
          backgroundColor="#FEFEFE"
          position="relative"
          top={-25}
        >
          {/* Header/Rating */}
          <Box
            mx={16}
            marginVertical={16}
            flexDirection="row"
            justifyContent="space-between"
          >
            <Heading fontSize={26} fontWeight="$semibold" color="#000000">
              {publication.name}
            </Heading>

            <Rating
              imageSize={20}
              readonly
              startingValue={publication.ratingMedia | 0}
            ></Rating>
          </Box>

          {/* IconLocation/TextLink */}
          <Box mx={16} flexDirection="row" alignItems="center">
            <MapPinned size={30} color="#BFA27E" />
            <Text ml={2} fontWeight="$light" fontSize={14}>
              {" "}
              {publication.address}
            </Text>
          </Box>

          {/* ImageProp/NameProp/Range/TimeRange */}
          <Box mx={16} my={16} flexDirection="row">
            {userAvatarUrl ? (
              <Avatar bgColor="#BFA27E" size="lg">
                <AvatarImage source={{ uri: userAvatarUrl }} alt="avatar" />
              </Avatar>
            ) : (
              <Avatar bgColor="#BFA27E" size="xl">
                <AvatarFallbackText>AA</AvatarFallbackText>
              </Avatar>
            )}
            <Box ml={10} top={8}>
              <Text fontSize={20} color="black" fontWeight="$semibold">
                Propietario
              </Text>
            </Box>
          </Box>

          <Box mx={16} my={16} marginTop={0}>
            <Text color="#000000" fontSize={20} fontWeight="$semibold">
              Price p/night
            </Text>
            <Text marginTop={10} fontSize={16} fontWeight="$light">
              MXN ${publication.price}
            </Text>
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
            <Box flexDirection="row" alignItems="center" marginTop={"$2"}>
              <Entypo name="email" size={24} color="black" />
              <Text pl={"$3"} fontSize={16} fontWeight="$light">
                {publication.email}
              </Text>
            </Box>

            <TouchableOpacity onPress={handleWhatsAppPress}>
            <Box flexDirection="row" alignItems="center" marginTop={"$2"}>
              
              <FontAwesome name="whatsapp" size={24} color="black" />
              
              <Text pl={"$3"} fontSize={16} fontWeight="$light">
                {publication.phone}
              </Text>
            </Box>
            </TouchableOpacity>

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
                    alt="pool"
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
                    alt="sofa"
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
                    alt="bathub"
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
                    alt="weber"
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
                    alt="pool"
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
                    alt="stars"
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
                    alt="bathub"
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
                    alt="weber"
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
                style={{ width: "100%", height: 200, borderRadius: 20 }}
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

          <Box mx={16} my={16} marginTop={0} alignItems="center"> 
          <BtnReservation idPlace={publication.id}></BtnReservation>
          </Box>
          

          {/* Opinions average */}
          <Box mx={16} my={16} marginTop={0}>
            <Text color="#333333" fontSize={18} fontWeight="$semibold">
              Opinions
            </Text>
            <Box
              marginTop={5}
              alignItems="flex-start"
              justifyContent="space-between"
            >
              <Text fontWeight="$bold" color="#EBC351" size="2xl">
                {publication.ratingMedia}
              </Text>

              <Rating
                imageSize={20}
                readonly
                startingValue={publication.ratingMedia | 0}
              ></Rating>
            </Box>

            {/* ReviewPlace */}
            <Box marginTop={10} alignItems="center">
              <Text color="#333333" fontSize={18} fontWeight="$semibold">
                Write your opinion
              </Text>
              <AirbnbRating
                reviews={["1", "2", "3", "4", "5"]}
                count={5}
                defaultRating={formik.values.rating}
                onFinishRating={(rating) =>
                  formik.setFieldValue("rating", rating)
                }
                size={30}
              />
              <Textarea
                marginTop={10}
                size="md"
                isReadOnly={false}
                isInvalid={true}
                isDisabled={false}
              >
                <TextareaInput
                  onChangeText={(text) => formik.setFieldValue("comment", text)}
                  placeholder="Your text goes here..."
                />
              </Textarea>
              <Text color="red">{formik.errors.comment}</Text>

              <Box right={0}>
                <TouchableOpacity
                  style={{
                    borderRadius: 20,
                    padding: 10,
                    paddingHorizontal: 16,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#BFA27E",
                  }}
                  onPress={formik.handleSubmit}
                >
                  <Text pr={6} fontSize={18} fontWeight="$medium" color="white">
                    Send Review
                  </Text>
                  <SendHorizonal color="white" size={18}></SendHorizonal>
                </TouchableOpacity>
              </Box>
            </Box>
          </Box>

          {/* Coments */}
          <Box mx={16} my={16} marginTop={0}>
            <Text color="#000000" fontSize={18} fontWeight="$semibold">
              Coments
            </Text>
            {map(reviews, (review) => {
              const data = review.data();
              const createdReview = new Date(data.createdAt.seconds * 1000);
              return (
                <>
                  <Box
                    borderBottomWidth="$1"
                    borderColor="$trueGray800"
                    $dark-borderColor="$trueGray100"
                    $base-pl={0}
                    $base-pr={0}
                    $sm-pl="$4"
                    $sm-pr="$5"
                    py="$2"
                  >
                    <HStack space="xl" justifyContent="flex-start">
                      <Avatar size="md">
                        <AvatarImage source={{ uri: data.avatar }}
                        alt="imageAvatarReview" />
                      </Avatar>
                      <VStack justifyContent="center" alignItems="baseline" space="md">
                        <Text
                          color="$coolGray800"
                          fontWeight="$medium"
                          $dark-color="$warmGray100"
                        >
                          Review at {DateTime.fromISO(createdReview.toISOString()).toFormat("yyyy/LL/dd - hh:mm")}
                        </Text>
                        <Text color="$coolGray600" $dark-color="$warmGray200">
                          {data.comment}
                        </Text>
                        <AirbnbRating
                        defaultRating={data.rating}
                        showRating={false}
                        size={15}
                        isDisabled
                        ></AirbnbRating>
                      </VStack>

                    </HStack>
                  </Box>
                </>
              );
            })}
          </Box>
        </Box>
      </KeyboardAwareScrollView>
    </VStack>
  );
};

export default Publication;
