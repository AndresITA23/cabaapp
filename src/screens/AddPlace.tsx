import { VStack, Box, Heading, Text, FormControl, TextareaInput, Textarea, FormControlHelper, FormControlHelperText, Input, InputIcon, InputField, ScrollView } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { MapPin, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Settings from "./Settings";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./AddPlace/AddPlace.data";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import MapView, { Marker } from "react-native-maps";

const AddStack = createNativeStackNavigator();

const NamePlace = () => {
    const navigation = useNavigation();
    // const { formik } = props;

    return (
        <VStack flex={1} backgroundColor="white">
            <Box mx={16} mt={38}>
                <Heading style={styles.headerText}>What is the name of your place?</Heading>
            </Box>
            <Box mx={16} my={16}>
                <FormControl>
                    <Textarea h={100} isReadOnly={false} isRequired={true} borderRadius={15} borderWidth={2}>
                        <TextareaInput fontSize={18} mx={16} my={10} maxLength={45} multiline={false}
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
                    <TouchableOpacity style={styles.buttonNext} onPress={() => navigation.navigate("DescriptionPlace")}>
                        <Text style={styles.buttonNextText}>Next</Text>
                    </TouchableOpacity>
                </Box>
            </Box>
        </VStack>
    );
}

const DescriptionPlace = () => {
    const navigation = useNavigation();
    // const { formik } = props;

    return (
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
                <Box w="20%" h={5} bg="black" borderTopRightRadius={20} borderBottomEndRadius={20}></Box>
            </Box>
            <Box w="100%" h={120} position="absolute" bottom={0}>
                <Box position="absolute" top={20} left={24}>
                    <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.goBack()}>
                        <Text style={styles.buttonBackText}>Back</Text>
                    </TouchableOpacity>
                </Box>
                <Box position="absolute" top={20} right={24}>
                    <TouchableOpacity style={styles.buttonNext} onPress={() => navigation.navigate("FacilitiesPlace")}>
                        <Text style={styles.buttonNextText}>Next</Text>
                    </TouchableOpacity>
                </Box>
            </Box>
        </VStack>
    );
}

const FacilitiesPlace = () => {
    const navigation = useNavigation();
    return (
        <VStack flex={1} backgroundColor="white">
            <Box mx={16} mt={38}>
                <Heading style={styles.headerText}>What facilities does your place have to offer?</Heading>
            </Box>
            {/* Footer */}
            <Box w="100%" position="absolute" bottom={121} h={5} backgroundColor="#D9D9D9">
                <Box w="40%" h={5} bg="black" borderTopRightRadius={20} borderBottomEndRadius={20}></Box>
            </Box>
            <Box w="100%" h={120} position="absolute" bottom={0}>
                <Box position="absolute" top={20} left={24}>
                    <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.goBack()}>
                        <Text style={styles.buttonBackText}>Back</Text>
                    </TouchableOpacity>
                </Box>
                <Box position="absolute" top={20} right={24}>
                    <TouchableOpacity style={styles.buttonNext} onPress={() => navigation.navigate("AddressPlace")}>
                        <Text style={styles.buttonNextText}>Next</Text>
                    </TouchableOpacity>
                </Box>
            </Box>
        </VStack>
    );
}

const AddressPlace = () => {
    const navigation = useNavigation();
    // const { formik } = props;
    // const [showModal, setShowModal] = useState(false);

    // const onOpenCloseMap = () => {
    //     setShowModal(!showModal);
    // };

    const [location, setLocation] = useState(null);
    useEffect(() => {
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
    }, []);



    return (
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
                        }} onPress={() => navigation.navigate("Address")}>
                            <MapPin size={18} color="black"></MapPin>
                            <Text pl={6} color="black" fontSize={18} fontWeight="$normal">Get into your address...</Text>
                        </TouchableOpacity>
                    </Box>
                </Box>
            </Box>
            {/* Footer */}
            <Box w="100%" position="absolute" bottom={121} h={5} backgroundColor="#D9D9D9">
                <Box w="60%" h={5} bg="black" borderTopRightRadius={20} borderBottomEndRadius={20}></Box>
            </Box>
            <Box w="100%" h={120} position="absolute" bottom={0} bg="white">
                <Box position="absolute" top={20} left={24}>
                    <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.goBack()}>
                        <Text style={styles.buttonBackText}>Back</Text>
                    </TouchableOpacity>
                </Box>
                <Box position="absolute" top={20} right={24}>
                    <TouchableOpacity style={styles.buttonNext} onPress={() => navigation.navigate("TimePlace")}>
                        <Text style={styles.buttonNextText}>Next</Text>
                    </TouchableOpacity>
                </Box>
            </Box>
        </VStack>
    );
}

const Address = () => {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            animation: 'fade',
            headerTitleStyle: {
                fontSize: 18,

            },
            headerStyle: {
                backgroundColor:"#EFEFEF",
            },
            headerTitle: "Get into your address",
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Box alignItems="center" borderRadius={10} justifyContent="center">
                        <X color="rgba(64, 64, 64, 1)" size={22} />
                    </Box>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        try {
            // Realiza la solicitud a la API de OpenStreetMap Nominatim para buscar la dirección
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();

            setSearchResults(data); // Actualiza los resultados de la búsqueda
        } catch (error) {
            console.error('Error al buscar la dirección:', error);
        }
    };

    return (
        <VStack bg="#EFEFEF">
            <Box my={16} mx={16}>
                <Input style={{
                    paddingHorizontal: 16, width: "100%", borderRadius: 30, borderWidth: 1, borderColor: "black", backgroundColor: "#EFEFEF", flexDirection: "row", alignItems: "center",
                }}>
                    <InputIcon as={MapPin} color="black" size={18} />
                    <InputField pl={10} placeholder="Search" 
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    onSubmitEditing={handleSearch}/>
                </Input>
            </Box>
            <ScrollView>
                {searchResults.map((result, index) => (
                    <TouchableOpacity key={index}>
                        <Box p={4} borderBottomWidth={1} borderColor="#ccc">
                            <Text>{result.display_name}</Text>
                        </Box>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </VStack>
    );
}

const TimePlace = () => {
    const navigation = useNavigation();
    return (
        <VStack flex={1} backgroundColor="white">
            <Box mx={16} mt={38}>
                <Heading style={styles.headerText}>What hours does your place have?</Heading>
            </Box>
            {/* Footer */}
            <Box w="100%" position="absolute" bottom={121} h={5} backgroundColor="#D9D9D9">
                <Box w="$80" h={5} bg="black" borderTopRightRadius={20} borderBottomEndRadius={20}></Box>
            </Box>
            <Box w="100%" h={120} position="absolute" bottom={0}>
                <Box position="absolute" top={20} left={24}>
                    <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.goBack()}>
                        <Text style={styles.buttonBackText}>Back</Text>
                    </TouchableOpacity>
                </Box>
                <Box position="absolute" top={20} right={24}>
                    <TouchableOpacity style={styles.buttonNext} onPress={() => navigation.navigate("CapacityPlace")}>
                        <Text style={styles.buttonNextText}>Next</Text>
                    </TouchableOpacity>
                </Box>
            </Box>
        </VStack>
    );
}

const CapacityPlace = () => {
    const navigation = useNavigation();
    return (
        <VStack flex={1} backgroundColor="white">
            <Box mx={16} mt={38}>
                <Heading style={styles.headerText}>What is the capacity of your place?</Heading>
            </Box>
            {/* Footer */}
            <Box w="100%" position="absolute" bottom={121} h={5} backgroundColor="#D9D9D9">
                <Box w="100%" h={5} bg="black" borderTopRightRadius={20} borderBottomEndRadius={20}></Box>
            </Box>
            <Box w="100%" h={120} position="absolute" bottom={0} >
                <Box position="absolute" top={20} left={24}>
                    <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.goBack()}>
                        <Text style={styles.buttonBackText}>Back</Text>
                    </TouchableOpacity>
                </Box>
                <Box position="absolute" top={20} right={24}>
                    <TouchableOpacity style={styles.buttonNext} onPress={() => navigation.navigate("Settings")}>
                        <Text style={styles.buttonNextText}>Save</Text>
                    </TouchableOpacity>
                </Box>
            </Box>
        </VStack>
    );
}

const AddPlace = () => {
    const navigation = useNavigation();
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
    }, [navigation]);

    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: validationSchema(),
        validateOnChange: false,
        onSubmit: async (formValue) => {
            console.log(formValue)
        }
    });

    return (
        <AddStack.Navigator initialRouteName="NamePlace">
            <AddStack.Screen name="NamePlace" component={NamePlace} options={{ animation: 'fade', headerShown: false }} />
            <AddStack.Screen name="DescriptionPlace" component={DescriptionPlace} options={{ animation: 'fade', headerShown: false }} />
            <AddStack.Screen name="FacilitiesPlace" component={FacilitiesPlace} options={{ animation: 'fade', headerShown: false }} />
            <AddStack.Screen name="AddressPlace" component={AddressPlace} options={{ animation: 'fade', headerShown: false }} />
            <AddStack.Screen name="Address" component={Address} options={{ animation: 'fade', presentation:"modal" }} />
            <AddStack.Screen name="TimePlace" component={TimePlace} options={{ animation: 'fade', headerShown: false }} />
            <AddStack.Screen name="CapacityPlace" component={CapacityPlace} options={{ animation: 'fade', headerShown: false }} />         
        </AddStack.Navigator>
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
    }
});

export default AddPlace;