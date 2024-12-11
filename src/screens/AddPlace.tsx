import { Box, FormControl, FormControlHelper, FormControlHelperText, Heading, Input, InputField, Text, Textarea, TextareaInput, VStack, View } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { Clock, DollarSign, MapPin, MapPinnedIcon, Phone, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Toast from "react-native-toast-message";
import { Entypo } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoadingModal from "../components/LoadingModal";
import { v4 as uuid } from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import { db } from "../utils";
import { initialValues, validationSchema } from "./AddPlace/AddPlace.data";
import { useFormik } from "formik";
import UploadImagesForm from "./AddPlace/UploadImagesForm";
import PrimaryImagePlace from "./AddPlace/PrimaryImagePlace";

const Addplace2 = () => {
    const [isLoading, setIsLoading] = useState(false);
    const auth = getAuth();
    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: validationSchema(),
        validateOnChange: false,
        onSubmit: async (formValue) => {
            try {
                setIsLoading(true);
                const newData = formValue;
                newData.id = uuid();
                newData.createdAt = new Date();
                newData.userId = auth.currentUser.uid;

                console.log(newData);


                await setDoc(doc(db, "places", newData.id), newData);
                setIsLoading(false);
                navigation.goBack();
            } catch (error) {
                console.log(error);
            }
        },
    });

    const [isFocused, setIsFocused] = useState(false);

    const navigation = useNavigation();

    //Screen changes
    const [openCard, setOpenCard] = useState(0);

    //Location
    const [location, setLocation] = useState({
        latitude: 0.001,
        longitude: 0.001,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
    });



    // useEffect 
    useEffect(() => {
        navigation.setOptions({
            animation: 'fade',
            headerTitleStyle: {
                fontSize: 18,
            },
            headerStyle: {
                borderColor: "red",
                borderWidth: 2,
            },
            headerTitle: "Add your place",
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Box alignItems="center" borderRadius={10} justifyContent="center">
                        <X color="rgba(64, 64, 64, 1)" size={22} />
                    </Box>
                </TouchableOpacity>
            ),
        });
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                Toast.show({
                    type: "info",
                    position: "bottom",
                    text1: "You have to activate your location",
                });
                return;
            }
            const locationTemp = await Location.getCurrentPositionAsync({});

            setLocation({
                latitude: locationTemp.coords.latitude,
                longitude: locationTemp.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
            });
        })();

    }, [navigation]);

    const saveLocation = () => {
        console.log(location);
        formik.setFieldValue("location", location)
        setOpenCard(5);
    };

    const [name, setName] = useState('');

    const saveName = () => {
        console.log(name)
        formik.setFieldValue("name", name)
        setOpenCard(1)
    }

    const [description, setDescription] = useState('');

    const saveDescription = () => {
        console.log(description)
        formik.setFieldValue("description", description)
        setOpenCard(2)
    }

    const [address, setAddress] = useState('');

    const saveAddress = () => {
        console.log(address)
        formik.setFieldValue("address", address)
        setOpenCard(3)
    }

    const [price, setPrice] = useState("");
    const savePrice = () => {
        console.log(price)
        formik.setFieldValue("price", price)
        setOpenCard(6)
    }

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const saveEmailPhone = () => {
        console.log(email)
        console.log(phone)

        formik.setFieldValue("email", email)
        formik.setFieldValue("phone", phone)
        setOpenCard(7)
    }
    return (
        <VStack flex={1} backgroundColor="white">
            {/* NamePlace */}
            {openCard === 0 && (
                <>
                    <VStack flex={1} backgroundColor="white">
                        <Box mx={16} mt={38}>
                            <Heading style={styles.headerText}>What is the name of your place?</Heading>
                        </Box>
                        <Box mx={16} my={10}>
                            <Text style={styles.subText}>Enter a short name for the place.</Text>
                        </Box>
                        <Box mx={16} my={16}>
                            <FormControl isInvalid={false} isDisabled={false} isRequired={true}>
                                <Input h={100} borderRadius={15} borderWidth={2} $focus-borderColor="#BFA27E">
                                    <InputField fontSize={18} mx={16} my={10} maxLength={45} multiline={false} enterKeyHint="done"
                                        type="text"
                                        placeholder="Name of the place..."
                                        value={name}
                                        onChangeText={(text) => setName(text)}
                                    />
                                </Input>
                                <FormControlHelper>
                                    <FormControlHelperText color="red">
                                        {formik.errors.name}
                                    </FormControlHelperText>
                                </FormControlHelper>
                            </FormControl>
                        </Box>

                        {/* Footer */}
                        <Box w="100%" position="absolute" bottom={121} h={5} backgroundColor="#D9D9D9">
                            <Box w="0%" h={5} bg="#BFA27E" borderTopRightRadius={20} borderBottomEndRadius={20}></Box>
                        </Box>
                        <Box w="100%" h={120} position="absolute" bottom={0}>
                            <Box position="absolute" top={20} right={24} >
                                <TouchableOpacity style={styles.buttonNext } onPress={saveName} >
                                    <Text style={styles.buttonNextText}>Next</Text>
                                </TouchableOpacity>
                            </Box>
                        </Box>
                    </VStack>
                </>

            )}

            {/* DescriptionPlace */}
            {openCard === 1 && (
                <>
                    <VStack flex={1} backgroundColor="white">
                        <Box mx={16} mt={38}>
                            <Heading style={styles.headerText}>What description would you give to your place?</Heading>
                        </Box>

                        <Box mx={16} my={10}>
                            <Text style={styles.subText}>Enter the description of the place.</Text>
                        </Box>

                        <Box mx={16} my={16}>
                            <FormControl isInvalid={false} isDisabled={false} isRequired={true}>
                                <Input h={300} borderRadius={15} borderWidth={2} $focus-borderColor="#BFA27E">
                                    <InputField fontSize={18} mx={16} my={10} maxLength={200} multiline={false}
                                        placeholder="Enter your descrption here..."
                                        type="text"
                                        value={description}
                                        onChangeText={(text) => setDescription(text)}
                                    />
                                </Input>
                                <FormControlHelper>
                                    <FormControlHelperText color="red">
                                        {formik.errors.description}
                                    </FormControlHelperText>
                                </FormControlHelper>
                            </FormControl>
                        </Box>

                        {/* Footer */}
                        <Box w="100%" position="absolute" bottom={121} h={5} backgroundColor="#D9D9D9">
                            <Box w="16.67%" h={5} bg="#BFA27E" borderTopRightRadius={20} borderBottomEndRadius={20}></Box>
                        </Box>
                        <Box w="100%" h={120} position="absolute" bottom={0}>
                            <Box position="absolute" top={20} left={24}>
                                <TouchableOpacity style={styles.buttonBack} onPress={() => setOpenCard(0)}>
                                    <Text style={styles.buttonBackText}>Back</Text>
                                </TouchableOpacity>
                            </Box>
                            <Box position="absolute" top={20} right={24}>
                                <TouchableOpacity style={styles.buttonNext} onPress={saveDescription}>
                                    <Text style={styles.buttonNextText}>Next</Text>
                                </TouchableOpacity>
                            </Box>
                        </Box>
                    </VStack>
                </>
            )}

            {/* AddressPlace */}
            {openCard === 2 && (
                <>
                    <VStack flex={1} backgroundColor="white">
                        <Box mx={16} mt={38}>
                            <Heading style={styles.headerText}>What is your address?</Heading>
                        </Box>
                        <Box mx={16} my={10}>
                            <Text style={styles.subText}>Enter the address where your place is located.</Text>
                        </Box>

                        <FormControl isInvalid={false} isDisabled={false} isRequired={true} mx={16} my={40}  >
                            <Box flexDirection="row" alignItems="center" >
                                <MapPinnedIcon size={24} color={isFocused ? "#BFA27E" : "#A9A9A9"} />
                                <TextInput
                                    style={styles.addressInput}
                                    placeholder="Enter your address..."
                                    placeholderTextColor="#A9A9A9"
                                    value={address}
                                    maxLength={50}
                                    onChangeText={(text) => setAddress(text)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)} />
                            </Box>

                            <FormControlHelper>
                                <FormControlHelperText color="red" mt={16}>
                                    {formik.errors.address}
                                </FormControlHelperText>
                            </FormControlHelper>
                        </FormControl>

                        {/* Footer */}
                        <Box w="100%" position="absolute" bottom={121} h={5} backgroundColor="#D9D9D9">
                            <Box w="33.33%" h={5} bg="#BFA27E" borderTopRightRadius={20} borderBottomEndRadius={20}></Box>
                        </Box>
                        <Box w="100%" h={120} position="absolute" bottom={0}>
                            <Box position="absolute" top={20} left={24}>
                                <TouchableOpacity style={styles.buttonBack} onPress={() => setOpenCard(1)}>
                                    <Text style={styles.buttonBackText}>Back</Text>
                                </TouchableOpacity>
                            </Box>
                            <Box position="absolute" top={20} right={24}>
                                <TouchableOpacity style={styles.buttonNext} onPress={saveAddress}>
                                    <Text style={styles.buttonNextText}>Next</Text>
                                </TouchableOpacity>
                            </Box>
                        </Box>
                    </VStack>
                </>
            )}

            {/* LocationPlace */}
            {openCard === 3 && (
                <>
                    <VStack flex={1} backgroundColor="white">
                        <Box mx={16} mt={38}>
                            <Heading style={styles.headerText}>What is the address of the place?</Heading>
                        </Box>
                        <Box mx={16} my={10}>
                            <Text style={styles.subText}>Enter the exact address of your place.</Text>
                        </Box>
                        {/* InformationAddress */}
                        <Box my={16} >
                            <MapView
                                initialRegion={location}
                                showsUserLocation={true}
                                style={{ width: "100%", height: "100%" }}
                                onRegionChange={(locationTemp) => setLocation(locationTemp)}>
                                <Marker draggable coordinate={location}></Marker>
                            </MapView>

                            <Box w="100%" top={32} position="absolute">
                                <Box alignItems="center" mx={16} justifyContent="center" >
                                    <TouchableOpacity style={{
                                        padding: 12, paddingHorizontal: 16, width: "100%", borderRadius: 30, borderWidth: 1, borderColor: "#BFBFBF", backgroundColor: "white", flexDirection: "row", alignItems: "center",
                                        shadowColor: "black", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 8
                                    }}>
                                        <MapPin size={18} color="black"></MapPin>
                                        <Text pl={6} color="black" fontSize={18} fontWeight="$normal">Get into your address</Text>
                                    </TouchableOpacity>
                                </Box>
                            </Box>
                        </Box>
                        {/* Footer */}
                        <Box w="100%" position="absolute" bottom={121} h={5} backgroundColor="#D9D9D9">
                            <Box w="50%" h={5} bg="#BFA27E" borderTopRightRadius={20} borderBottomEndRadius={20}></Box>
                        </Box>
                        <Box w="100%" h={120} position="absolute" bottom={0} bg="white">
                            <Box position="absolute" top={20} left={24}>
                                <TouchableOpacity style={styles.buttonBack} onPress={() => setOpenCard(2)}>
                                    <Text style={styles.buttonBackText}>Back</Text>
                                </TouchableOpacity>
                            </Box>
                            <Box position="absolute" top={20} right={24}>
                                <TouchableOpacity style={styles.buttonNext} onPress={saveLocation}>
                                    <Text style={styles.buttonNextText}>Next</Text>
                                </TouchableOpacity>
                            </Box>
                        </Box>
                    </VStack>
                </>
            )}

            {/* TimePlace */}
            {/* {openCard === 4 && (
                <>
                    <VStack flex={1} backgroundColor="white">
                        <Box mx={16} mt={38}>
                            <Heading style={styles.headerText}>What hours does your place have?</Heading>
                        </Box>
                        <Box mx={16} my={10}>
                            <Text style={styles.subText}>Enter the exact hours of your place rental</Text>
                        </Box>
                        <Box mx={16} mt={32} flexDirection="row" alignItems="center" justifyContent="center">
                            <Box position="absolute" left={0}>
                                <Text fontSize={18} fontWeight="$normal">Check-in</Text>

                                <Box top={10} flexDirection="row" alignItems="center">
                                    <Box backgroundColor="#D9D9D9" h="100%" paddingHorizontal={5} alignItems="center" justifyContent="center" borderBottomLeftRadius={10} borderTopLeftRadius={10}>
                                        <Clock color="#a9a9a9" size={26} ></Clock>
                                    </Box>
                                    <TouchableOpacity style={styles.buttonTime} onPress={showStartTimePicker}>
                                        <Text color="black" fontSize={18}>{startTime ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Start hour"}</Text>
                                    </TouchableOpacity>
                                </Box>
                                <DateTimePickerModal
                                    isVisible={isStartTimePickerVisible}
                                    textColor="black"
                                    mode="time"
                                    onConfirm={handleStartTimeConfirm}
                                    onCancel={hideStartTimePicker}
                                />
                            </Box>
                            <Box top={10}>
                                <Text> </Text>
                                <Text fontSize={26} color="#646464"> - </Text>
                            </Box>
                            <Box position="absolute" right={0}>
                                <Text fontSize={18} fontWeight="$normal">Check-out</Text>

                                <Box top={10} flexDirection="row" alignItems="center">
                                    <Box backgroundColor="#D9D9D9" h="100%" paddingHorizontal={5} alignItems="center" justifyContent="center" borderBottomLeftRadius={10} borderTopLeftRadius={10}>
                                        <Clock color="#a9a9a9a" size={26} ></Clock>
                                    </Box>
                                    <TouchableOpacity style={styles.buttonTime} onPress={showEndTimePicker}>
                                        <Text color="black" fontSize={18}>{endTime ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "End hour"}</Text>
                                    </TouchableOpacity>
                                </Box>

                                <DateTimePickerModal
                                    isVisible={isEndTimePickerVisible}
                                    textColor="black"
                                    mode="time"
                                    onConfirm={handleEndTimeConfirm}
                                    onCancel={hideEndTimePicker}
                                />
                            </Box>
                        </Box>
                        <Box mx={64} top={50} alignItems="center" borderRadius={30} borderWidth={1} borderColor="#646464" padding={10}>
                            <Text fontSize={18} fontWeight="$medium">{duration !== null ? `Range: ${duration} hours` : ""}</Text>
                        </Box>
                        
                        <Box w="100%" position="absolute" bottom={121} h={5} backgroundColor="#D9D9D9">
                            <Box w="66.67%" h={5} bg="black" borderTopRightRadius={20} borderBottomEndRadius={20}></Box>
                        </Box>
                        <Box w="100%" h={120} position="absolute" bottom={0}>
                            <Box position="absolute" top={20} left={24}>
                                <TouchableOpacity style={styles.buttonBack} onPress={() => setOpenCard(3)}>
                                    <Text style={styles.buttonBackText}>Back</Text>
                                </TouchableOpacity>
                            </Box>
                            <Box position="absolute" top={20} right={24}>
                                <TouchableOpacity style={styles.buttonNext} onPress={() => setOpenCard(5)}>
                                    <Text style={styles.buttonNextText}>Next</Text>
                                </TouchableOpacity>
                            </Box>
                        </Box>
                    </VStack>
                </>
            )}
             */}

            {/* PricePlace */}
            {openCard === 5 && (
                <>
                    <VStack flex={1} backgroundColor="white">
                        <Box mx={16} mt={38}>
                            <Heading style={styles.headerText}>What is the price of your place?</Heading>
                        </Box>
                        <Box mx={16} my={10}>
                            <Text style={styles.subText}>Enter the total amount of your rental price.</Text>
                        </Box>
                        <Box mx={16} my={50} alignItems="center">
                            <FormControl isInvalid={false} isDisabled={false} isRequired={true}>
                                <Box mx={16} my={16} flexDirection="row" alignItems="center">
                                    <DollarSign size={50} color={isFocused ? "#BFA27E" : "#A9A9A9"} />
                                    <TextInput
                                        style={styles.priceInput}
                                        placeholder="Enter price"
                                        placeholderTextColor="#A9A9A9"
                                        onChangeText={(text) => setPrice(text)}
                                        value={price}
                                        maxLength={6}
                                        keyboardType="numeric"
                                        returnKeyType="done"
                                        onSubmitEditing={() => Keyboard.dismiss()}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                    />
                                </Box>
                                <FormControlHelper>
                                    <FormControlHelperText color="red">
                                        {formik.errors.price}
                                    </FormControlHelperText>
                                </FormControlHelper>
                            </FormControl>

                        </Box>
                        {/* Footer */}
                        <Box w="100%" position="absolute" bottom={121} h={5} backgroundColor="#D9D9D9">
                            <Box w="66.67%" h={5} bg="#BFA27E" borderTopRightRadius={20} borderBottomEndRadius={20}></Box>
                        </Box>
                        <Box w="100%" h={120} position="absolute" bottom={0}>
                            <Box position="absolute" top={20} left={24}>
                                <TouchableOpacity style={styles.buttonBack} onPress={() => setOpenCard(3)}>
                                    <Text style={styles.buttonBackText}>Back</Text>
                                </TouchableOpacity>
                            </Box>
                            <Box position="absolute" top={20} right={24}>
                                <TouchableOpacity style={styles.buttonNext} onPress={savePrice}>
                                    <Text style={styles.buttonNextText}>Next</Text>
                                </TouchableOpacity>
                            </Box>
                        </Box>
                    </VStack>
                </>
            )}
            {/* Email and Phone Place */}
            {openCard === 6 && (
                <>
                    <VStack flex={1} backgroundColor="white">
                        <Box mx={16} mt={38}>
                            <Heading style={styles.headerText}>Register your email and phone</Heading>
                        </Box>
                        <Box mx={16} my={10}>
                            <Text style={styles.subText}>Enter your number and email so they can contact you.</Text>
                        </Box>

                        <FormControl isInvalid={false} isDisabled={false} isRequired={true}>
                            <Box mx={16} my={16} flexDirection="row" alignItems="center">
                                <Entypo name="email" size={20} color={isFocused ? "#BFA27E" : "#A9A9A9"} />
                                <TextInput
                                    style={styles.emailInput}
                                    placeholder="Register your email"
                                    placeholderTextColor="#A9A9A9"
                                    value={email}
                                    onChangeText={(text) => setEmail(text)}
                                    keyboardType="email-address"
                                    returnKeyType="done"
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                />
                            </Box>
                            <FormControlHelper>
                                <FormControlHelperText color="red">
                                    {formik.errors.email}
                                </FormControlHelperText>
                            </FormControlHelper>
                        </FormControl>

                        <FormControl marginTop={"$4"} isInvalid={false} isDisabled={false} isRequired={true}>
                            <Box mx={16} my={16} flexDirection="row" alignItems="center">
                                <Phone size={20} color={isFocused ? "#BFA27E" : "#A9A9A9"} />
                                <TextInput
                                    style={styles.emailInput}
                                    placeholder="Register your phone"
                                    placeholderTextColor="#A9A9A9"
                                    value={phone}
                                    onChangeText={(text) => setPhone(text)}
                                    keyboardType="numeric"
                                    returnKeyType="done"
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                />
                            </Box>
                            <FormControlHelper>
                                <FormControlHelperText color="red">
                                    {formik.errors.phone}
                                </FormControlHelperText>
                            </FormControlHelper>
                        </FormControl>

                        {/* Footer */}
                        <Box w="100%" position="absolute" bottom={121} h={5} backgroundColor="#D9D9D9">
                            <Box w="83.33%" h={5} bg="#BFA27E" borderTopRightRadius={20} borderBottomEndRadius={20}></Box>
                        </Box>
                        <Box w="100%" h={120} position="absolute" bottom={0} >
                            <Box position="absolute" top={20} left={24}>
                                <TouchableOpacity style={styles.buttonBack} onPress={() => setOpenCard(5)}>
                                    <Text style={styles.buttonBackText}>Back</Text>
                                </TouchableOpacity>
                            </Box>
                            <Box position="absolute" top={20} right={24}>
                                <TouchableOpacity style={styles.buttonNext} onPress={saveEmailPhone}>
                                    <Text style={styles.buttonNextText}>Next</Text>
                                </TouchableOpacity>
                            </Box>
                        </Box>
                    </VStack>
                </>
            )}

            {/* ImagesPlace */}
            {openCard === 7 && (
                <>
                    <VStack flex={1} backgroundColor="white">
                        <Box mx={16} mt={38}>
                            <Heading style={styles.headerText}>Choose the images of your place</Heading>
                        </Box>
                        <Box mx={16} my={10}>
                            <Text style={styles.subText}>Enter images of your place.</Text>
                        </Box>

                        <PrimaryImagePlace formik={formik} />
                        <UploadImagesForm formik={formik} />

                        {/* Footer */}
                        <Box w="100%" position="absolute" bottom={121} h={5} backgroundColor="#D9D9D9">
                            <Box w="100%" h={5} bg="#BFA27E" borderTopRightRadius={20} borderBottomEndRadius={20}></Box>
                        </Box>
                        <Box w="100%" h={120} position="absolute" bottom={0} >
                            <Box position="absolute" top={20} left={24}>
                                <TouchableOpacity style={styles.buttonBack} onPress={() => setOpenCard(6)}>
                                    <Text style={styles.buttonBackText}>Back</Text>
                                </TouchableOpacity>
                            </Box>
                            <Box position="absolute" top={20} right={24}>
                                <TouchableOpacity style={styles.buttonNext} onPress={formik.handleSubmit}>
                                    <Text style={styles.buttonNextText}>Save</Text>
                                </TouchableOpacity>
                            </Box>
                        </Box>
                    </VStack>
                </>
            )}
        </VStack>
    );
}

const styles = StyleSheet.create({

    headerText: {
        fontSize: 30,
        fontWeight: "600",
        color: "black",
        lineHeight: 38,
    },
    subText: {
        fontSize: 20,
        color: "#a4a4a4"
    },
    buttonNext: {
        backgroundColor: "#BFA27E",
        height: 50,
        borderRadius: 30,
        paddingHorizontal: 50,
        justifyContent: "center",
    },
    buttonBack: {
        height: 50,

        paddingHorizontal: 16,
        justifyContent: "center",
    },
    buttonNextText: {
        color: "white",
        fontSize: 18,
        fontWeight: "500",
    },
    buttonBackText: {
        color: "black",
        fontSize: 18,
        fontWeight: "500",
        textDecorationLine: 'underline',
    },
    buttonTime: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        paddingHorizontal: 16,
    },
    addressInput: {
        fontSize: 25,
        paddingLeft: 5,
        fontWeight: "500",
        paddingRight: 16
    },
    priceInput: {       
        borderRadius: 10,
        
        fontSize: 50,
        color: "#BFA27E",
        fontWeight: "600",
    },
    emailInput: {
        paddingLeft: 10,
        paddingRight: 16,
        fontSize: 20,
        fontWeight: "400",

    },
    phoneInput: {
        padding: 16,
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 20,
        color: "#BFA27E",
        fontWeight: "600",
    },
});

export default Addplace2;