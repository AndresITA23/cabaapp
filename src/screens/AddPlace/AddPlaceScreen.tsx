import {
  View,
  Text,
  Button,
  ButtonText, 
  VStack,
  ScrollView,
  Box,
} from "@gluestack-ui/themed";
import React from "react";
import InfoForm from "../AddPlace/InfoForm";
import UploadImagesForm from "./UploadImagesForm";
import PrimaryImagePlace from "./PrimaryImagePlace";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./AddPlace.data";
import {db} from "../../utils"
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import {useNavigation} from '@react-navigation/native'
import { useState } from 'react';
import LoadingModal from "../../components/LoadingModal";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getAuth } from 'firebase/auth';

const AddPlaceScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth(); 

  const navigation = useNavigation();
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

  return (
    <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView>
        <PrimaryImagePlace formik={formik} />
        <InfoForm formik={formik} />
        <UploadImagesForm formik={formik} />
        </KeyboardAwareScrollView>
      <View style={{ padding: 10 }} marginBottom={'$1/5'}>
        <Button
          action={"primary"}
          variant={"solid"}
          size={"lg"}
          isDisabled={false}
          onPress={formik.handleSubmit}
        >
          <ButtonText>Create place</ButtonText>
        </Button>
      </View>
      {isLoading && ( 
        <LoadingModal show={isLoading} text="Creating place"></LoadingModal>
      )}
    </View>
  );
};
export default AddPlaceScreen;
