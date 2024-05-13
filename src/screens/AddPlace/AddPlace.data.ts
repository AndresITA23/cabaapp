import * as Yup from 'yup';

export function initialValues() { 
    return {
        name: "",
        description: "",
        address: "",
        price: "",
        email: "",
        phone: "",
        location: null,
        images: [],

    }
}

export function validationSchema () {
    return Yup.object({
        name: Yup.string().required("The name is required"),
        description: Yup.string().required("The description is required"),
        address: Yup.string().required("The address is required"),
        price: Yup.number().typeError("Please enter number value only").required("The price is required"),
        email: Yup.string().email("The email is not valid").required("The email is required"),
        phone: Yup.string().required("The phone is required"),
        location: Yup.object().required("The location is required"),
        images: Yup.array().min(1, "It requires at least 1 image").required("The image is required"),
    })
}