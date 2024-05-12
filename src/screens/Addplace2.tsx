import { Box, Button, FormControl, Heading, Input, InputField, Text, Textarea, TextareaInput, VStack, View } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { Clock, MapPin, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import MapView from "react-native-maps";
import Toast from "react-native-toast-message";
import DateTimePickerModal from "react-native-modal-datetime-picker";


const Addplace2 = () => {
    const navigation = useNavigation();

    //Screen changes
    const [openCard, setOpenCard] = useState(0);

    //Location
    const [location, setLocation] = useState(null);

    // Time
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [duration, setDuration] = useState(null);
    const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

    // Price:
    const [price, setPrice] = useState("");

    //Time consts:
    const showStartTimePicker = () => {
        setStartTimePickerVisible(true);
    };
    const hideStartTimePicker = () => {
        setStartTimePickerVisible(false);
    };
    const handleStartTimeConfirm = (time) => {   
        if (time.getHours() >= 0 && time.getMinutes() >= 0) {
            setStartTime(time);
            calculateDuration(time, endTime);
        } else {            
            console.log("No se permiten horas negativas");
        }
        hideStartTimePicker();
    };
    const showEndTimePicker = () => {
        setEndTimePickerVisible(true);
    };
    const hideEndTimePicker = () => {
        setEndTimePickerVisible(false);
    };
    const handleEndTimeConfirm = (time) => {      
        if (time.getHours() >= 0 && time.getMinutes() >= 0) {
            setEndTime(time);
            calculateDuration(startTime, time);
        } else {          
            console.log("No se permiten horas negativas");
        }
        hideEndTimePicker();
    };
    const calculateDuration = (start, end) => {
        if (start && end) { 
            if (end <= start) {   
                end.setDate(end.getDate() + 1);
            } 
            let diff = end.getTime() - start.getTime();
            diff = Math.max(0, diff);
            const hours = Math.floor(diff / (1000 * 60 * 60));
            setDuration(hours === 0 ? 24 : hours);
        } else {
            setDuration(null);
        }
    };

    // useEffect - Header/Time 
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
        calculateDuration(startTime, endTime);
    }, [startTime, endTime, navigation]);

    return (
        <VStack flex={1} backgroundColor="white">
            {/* NamePlace */}
            {openCard === 0 && (
                <>
                    <VStack flex={1} backgroundColor="white">
                        <Box mx={16} mt={38}>
                            <Heading style={styles.headerText}>What is the name of your place?</Heading>
                        </Box>
                        <Box mx={16} my={16}>
                            <FormControl>
                                <Textarea h={100} isReadOnly={false} isRequired={true} borderRadius={15} borderWidth={2}>
                                    <TextareaInput fontSize={18} mx={16} my={10} maxLength={45} multiline={false} enterKeyHint="done"
                                        placeholder="Enter text here..."
                                    // onChangeText={(text) => formik.setFieldValue("name", text)} 
                                    />
                                </Textarea>
                                {/* <FormControlHelper>
                        <FormControlHelperText color="red">
                            {formik.errors.name}
                        </FormControlHelperText>
                    </FormControlHelper> */}
                            </FormControl>
                        </Box>
                        {/* Footer */}
                        <Box w="100%" position="absolute" bottom={121} h={5} backgroundColor="#D9D9D9">
                            <Box w="0%" h={5} bg="black" borderTopRightRadius={20} borderBottomEndRadius={20}></Box>
                        </Box>
                        <Box w="100%" h={120} position="absolute" bottom={0}>
                            <Box position="absolute" top={20} right={24} >
                                <TouchableOpacity style={styles.buttonNext} onPress={() => setOpenCard(1)}>
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
                        <Box mx={16} my={16}>
                            <FormControl>
                                <Textarea h={300} isReadOnly={false} isRequired={true} borderRadius={15} borderWidth={2}>
                                    <TextareaInput fontSize={18} mx={16} my={10} maxLength={45} multiline={false}
                                        placeholder="Enter text here..."
                                    // onChangeText={(text) => formik.setFieldValue("description", text)} 
                                    />
                                </Textarea>
                                {/* <FormControlHelper>
                        <FormControlHelperText color="red">
                            {formik.errors.description}
                        </FormControlHelperText>
                    </FormControlHelper> */}
                            </FormControl>
                        </Box>

                        {/* Footer */}
                        <Box w="100%" position="absolute" bottom={121} h={5} backgroundColor="#D9D9D9">
                            <Box w="16.67%" h={5} bg="black" borderTopRightRadius={20} borderBottomEndRadius={20}></Box>
                        </Box>
                        <Box w="100%" h={120} position="absolute" bottom={0}>
                            <Box position="absolute" top={20} left={24}>
                                <TouchableOpacity style={styles.buttonBack} onPress={() => setOpenCard(0)}>
                                    <Text style={styles.buttonBackText}>Back</Text>
                                </TouchableOpacity>
                            </Box>
                            <Box position="absolute" top={20} right={24}>
                                <TouchableOpacity style={styles.buttonNext} onPress={() => setOpenCard(2)}>
                                    <Text style={styles.buttonNextText}>Next</Text>
                                </TouchableOpacity>
                            </Box>
                        </Box>
                    </VStack>
                </>
            )}

            {/* FacilitiesPlace */}
            {openCard === 2 && (
                <>
                    <VStack flex={1} backgroundColor="white">
                        <Box mx={16} mt={38}>
                            <Heading style={styles.headerText}>What facilities does your place have to offer?</Heading>
                        </Box>
                        {/* Footer */}
                        <Box w="100%" position="absolute" bottom={121} h={5} backgroundColor="#D9D9D9">
                            <Box w="33.33%" h={5} bg="black" borderTopRightRadius={20} borderBottomEndRadius={20}></Box>
                        </Box>
                        <Box w="100%" h={120} position="absolute" bottom={0}>
                            <Box position="absolute" top={20} left={24}>
                                <TouchableOpacity style={styles.buttonBack} onPress={() => setOpenCard(1)}>
                                    <Text style={styles.buttonBackText}>Back</Text>
                                </TouchableOpacity>
                            </Box>
                            <Box position="absolute" top={20} right={24}>
                                <TouchableOpacity style={styles.buttonNext} onPress={() => setOpenCard(3)}>
                                    <Text style={styles.buttonNextText}>Next</Text>
                                </TouchableOpacity>
                            </Box>
                        </Box>
                    </VStack>
                </>
            )}

            {/* AddressPlace */}
            {openCard === 3 && (
                <>
                    <VStack flex={1} backgroundColor="white">
                        <Box mx={16} mt={38}>
                            <Heading style={styles.headerText}>What is the address of the place?</Heading>
                        </Box>
                        {/* InformationAddress */}
                        <Box my={16}>
                            <MapView
                                initialRegion={location}
                                showsUserLocation={true}
                                style={{ width: "100%", height: "100%" }}>
                            </MapView>

                            <Box w="100%" top={32} position="absolute">
                                <Box alignItems="center" mx={16} justifyContent="center" >
                                    <TouchableOpacity style={{
                                        padding: 12, paddingHorizontal: 16, width: "100%", borderRadius: 30, borderWidth: 1, borderColor: "#BFBFBF", backgroundColor: "white", flexDirection: "row", alignItems: "center",
                                        shadowColor: "black", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 8
                                    }}>
                                        <MapPin size={18} color="black"></MapPin>
                                        <Text pl={6} color="black" fontSize={18} fontWeight="$normal">Get into your address...</Text>
                                    </TouchableOpacity>
                                </Box>
                            </Box>
                        </Box>
                        {/* Footer */}
                        <Box w="100%" position="absolute" bottom={121} h={5} backgroundColor="#D9D9D9">
                            <Box w="50%" h={5} bg="black" borderTopRightRadius={20} borderBottomEndRadius={20}></Box>
                        </Box>
                        <Box w="100%" h={120} position="absolute" bottom={0} bg="white">
                            <Box position="absolute" top={20} left={24}>
                                <TouchableOpacity style={styles.buttonBack} onPress={() => setOpenCard(2)}>
                                    <Text style={styles.buttonBackText}>Back</Text>
                                </TouchableOpacity>
                            </Box>
                            <Box position="absolute" top={20} right={24}>
                                <TouchableOpacity style={styles.buttonNext} onPress={() => setOpenCard(4)}>
                                    <Text style={styles.buttonNextText}>Next</Text>
                                </TouchableOpacity>
                            </Box>
                        </Box>
                    </VStack>
                </>
            )}

            {/* TimePlace */}
            {openCard === 4 && (
                <>
                    <VStack flex={1} backgroundColor="white">
                        <Box mx={16} mt={38}>
                            <Heading style={styles.headerText}>What hours does your place have?</Heading>
                        </Box>
                        <Box mx={16} mt={32} flexDirection="row" alignItems="center" justifyContent="center">
                            <Box position="absolute" left={0}>
                                <Text fontSize={18} fontWeight="$normal">Check-in</Text>

                                <Box top={10} flexDirection="row" alignItems="center">
                                    <Box backgroundColor="#D9D9D9" h="100%" paddingHorizontal={5} alignItems="center" justifyContent="center" borderBottomLeftRadius={10} borderTopLeftRadius={10}>
                                        <Clock color="#BFA27E" size={26} ></Clock>
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
                                        <Clock color="#BFA27E" size={26} ></Clock>
                                    </Box>
                                    <TouchableOpacity style={styles.buttonTime} onPress={showEndTimePicker}>
                                        <Text color="black"  fontSize={18}>{endTime ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "End hour"}</Text>
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
                        {/* Footer */}
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

            {/* PricePlace */}
            {openCard === 5 && (
                <>
                    <VStack flex={1} backgroundColor="white">
                        <Box mx={16} mt={38}>
                            <Heading style={styles.headerText}>What is the price of your place?</Heading>
                        </Box>
                        <Box mx={16} my={50} alignItems="center">
                            <TextInput
                                style={styles.priceInput}
                                placeholder="Enter price"
                                placeholderTextColor="#A9A9A9"
                                onChangeText={(text) => {
                                    if (text === "") {
                                        setPrice("");
                                    } else if (text.startsWith("$")) {
                                        setPrice(text);
                                    } else {
                                        setPrice("$" + text);
                                    }
                                }}
                                value={price}
                                maxLength={6}
                                keyboardType="numeric"
                                returnKeyType="done"
                                onSubmitEditing={() => Keyboard.dismiss()}
                            />
                        </Box>
                        {/* Footer */}
                        <Box w="100%" position="absolute" bottom={121} h={5} backgroundColor="#D9D9D9">
                            <Box w="83.33%" h={5} bg="black" borderTopRightRadius={20} borderBottomEndRadius={20}></Box>
                        </Box>
                        <Box w="100%" h={120} position="absolute" bottom={0}>
                            <Box position="absolute" top={20} left={24}>
                                <TouchableOpacity style={styles.buttonBack} onPress={() => setOpenCard(4)}>
                                    <Text style={styles.buttonBackText}>Back</Text>
                                </TouchableOpacity>
                            </Box>
                            <Box position="absolute" top={20} right={24}>
                                <TouchableOpacity style={styles.buttonNext} onPress={() => setOpenCard(6)}>
                                    <Text style={styles.buttonNextText}>Next</Text>
                                </TouchableOpacity>
                            </Box>
                        </Box>
                    </VStack>
                </>
            )}

            {/* ImagesPlace */}
            {openCard === 6 && (
                <>
                    <VStack flex={1} backgroundColor="white">
                        <Box mx={16} mt={38}>
                            <Heading style={styles.headerText}>Choose the images of your place</Heading>
                        </Box>
                        {/* Footer */}
                        <Box w="100%" position="absolute" bottom={121} h={5} backgroundColor="#D9D9D9">
                            <Box w="100%" h={5} bg="black" borderTopRightRadius={20} borderBottomEndRadius={20}></Box>
                        </Box>
                        <Box w="100%" h={120} position="absolute" bottom={0} >
                            <Box position="absolute" top={20} left={24}>
                                <TouchableOpacity style={styles.buttonBack} onPress={() => setOpenCard(5)}>
                                    <Text style={styles.buttonBackText}>Back</Text>
                                </TouchableOpacity>
                            </Box>
                            <Box position="absolute" top={20} right={24}>
                                <TouchableOpacity style={styles.buttonNext} onPress={() => navigation.goBack}>
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
        fontSize: 28,
        fontWeight: "600",
        color: "black",
        lineHeight: 38,
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
    priceInput: {
        padding: 16,
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 50,
        color: "#BFA27E",
        fontWeight: "600",
    },
});

export default Addplace2;