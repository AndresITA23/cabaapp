import React, { useState } from "react";
import {
  View,
  Box,
  Text,
  FormControl,
  Input,
  InputField,
  FormControlHelper,
  FormControlHelperText,
  VStack,
} from "@gluestack-ui/themed";
import MapForm from "./MapForm";
import { MapPinned } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const InfoForm = (props) => {
  const { formik } = props;

  const [showModal, setShowModal] = useState(false);

  const onOpenCloseMap = () => {
    setShowModal(!showModal);
  }; 

  return (
    <>
      <View>
        <Box mx={16} my={16} marginTop={5}>
          <Text color="#000000" fontSize={18} fontWeight="$semibold">
            Information of the place
          </Text>
          <Box marginTop={15}>
            <FormControl
              marginTop={"$4"}
              isInvalid={false}
              size={"md"}
              isDisabled={false}
              isRequired={true}
            >
              <Input borderRadius="$xl" bgColor="white">
                <InputField
                  type="text"
                  placeholder="Name of the place"
                  fontWeight="$bold"
                  onChangeText={(text) => formik.setFieldValue("name", text)}
                />
              </Input>
              <FormControlHelper>
                <FormControlHelperText color="red">
                  {formik.errors.name}
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>

            <FormControl
              marginTop={"$4"}
              isInvalid={false}
              size={"md"}
              isDisabled={false}
              isRequired={true}
            >
              <Input borderRadius="$xl" bgColor="white">
                <InputField
                  type="text"
                  placeholder="Description"
                  fontWeight="$bold"
                  onChangeText={(text) =>
                    formik.setFieldValue("description", text)
                  }
                />
              </Input>
              <FormControlHelper>
                <FormControlHelperText color="red">
                  {formik.errors.description}
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>

            <FormControl
              marginTop={"$4"}
              isInvalid={false}
              size={"md"}
              isDisabled={false}
              isRequired={true}
            >
              <Input borderRadius="$xl" bgColor="white">
                <InputField
                  type="text"
                  placeholder="Address"
                  fontWeight="$bold"
                  onChangeText={(text) => formik.setFieldValue("address", text)}
                />
              </Input>
              <FormControlHelper>
                <FormControlHelperText color="red">
                  {formik.errors.address}
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>

            <TouchableOpacity onPress={onOpenCloseMap}>
              <MapPinned color={getColorIconMap(formik)} size={38} />
            </TouchableOpacity>

            <FormControl
              marginTop={"$4"}
              isInvalid={false}
              size={"md"}
              isDisabled={false}
              isRequired={true}
            >
              <Input borderRadius="$xl" bgColor="white">
              <FontAwesome5 name="dollar-sign" size={22} color="#BFA27E" style={{left: 12, top: 8 }} />
                <InputField
                  marginLeft={10}
                  type="text"
                  placeholder="Price for night"
                  fontWeight="$bold"
                  onChangeText={(text) => formik.setFieldValue("price", text)}
                />
              </Input>
              <FormControlHelper>
                <FormControlHelperText color="red">
                  {formik.errors.price}
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>

            <FormControl
              marginTop={"$4"}
              isInvalid={false}
              size={"md"}
              isDisabled={false}
              isRequired={true}
            >
              <Input borderRadius="$xl" bgColor="white">
              <Entypo name="email" size={20} color="#BFA27E" style={{left: 10, top: 8 }} />
                <InputField
                marginLeft={6}
                  type="text"
                  placeholder="Email"
                  fontWeight="$bold"
                  onChangeText={(text) => formik.setFieldValue("email", text)}
                />
              </Input>
              <FormControlHelper>
                <FormControlHelperText color="red">
                  {formik.errors.email}
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>

            <FormControl
              marginTop={"$4"}
              isInvalid={false}
              size={"md"}
              isDisabled={false}
              isRequired={true}
            >
              <Input borderRadius="$xl" bgColor="white">
                <InputField
                  type="text"
                  placeholder="Phone"
                  fontWeight="$bold"
                  onChangeText={(text) => formik.setFieldValue("phone", text)}
                />
              </Input>
              <FormControlHelper>
                <FormControlHelperText color="red">
                  {formik.errors.phone}
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>
          </Box>
        </Box>


      </View>

      {showModal && (
        <MapForm
          show={showModal}
          close={() => setShowModal(false)}
          formik={formik}
        />
      )}
    </>
  );
};

const getColorIconMap = (formik) => {
  if (formik.errors.location) return "#ff0000";

  if (formik.values.location) return "#BFA27E";

  return "#c2c2c2";
};

export default InfoForm;
