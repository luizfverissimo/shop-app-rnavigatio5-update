import React, { useState, useEffect, useCallback, useReducer } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import * as productActions from "../../store/actions/products";

import HeaderButton from "../../components/UI/HeaderButton";
import Input from "../../components/UI/Input";
import Colors from '../../constants/colors'

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updateValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updateValidities) {
      updatedFormIsValid = updatedFormIsValid && updateValidities[key];
    }

    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updateValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const EditProductScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  const prodId = props.navigation.getParam("productId");
  const editedProduct = useSelector((state) =>
    state.products.userProducts.find((prod) => prod.id === prodId)
  );

  const dispatch = useDispatch();

  const [formState, dispachFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: "",
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{text: "Okay"}])
    }
  }, [error])

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "Please check de errors in the form", [
        { text: "Okay" },
      ]);
      return;
    }
    setError(null)
    setIsLoading(true)

    try {
      if (editedProduct) {
        await dispatch(
          productActions.updateProduct(
            prodId,
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl
          )
        );
      } else {
        await dispatch(
          productActions.createProduct(
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl,
            +formState.inputValues.price
          )
        );
      }
      props.navigation.goBack();
    } catch (error) {
      setError(error.message)
    }    
    setIsLoading(false)
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispachFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispachFormState]
  );

  if (isLoading) {
    return (
      <View style={styles.centered} >
        <ActivityIndicator size='large' color={Colors.primary}/>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior='height'
      keyboardVerticalOffset={50}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="title"
            label="Title"
            errorText="Please enter a valid title."
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.title : ""}
            initiallyValid={!!editedProduct}
            required
          />
          <Input
            id="imageUrl"
            label="Image URL"
            errorText="Please enter a valid URL."
            keyboardType="default"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.imageUrl : ""}
            initiallyValid={!!editedProduct}
            required
          />

          {editedProduct ? null : (
            <Input
              id="price"
              label="Price"
              errorText="Please enter a valid price."
              keyboardType="decimal-pad"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              required
              min={0.1}
            />
          )}

          <Input
            id="description"
            label="Description"
            errorText="Please enter a valid description."
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.description : ""}
            initiallyValid={!!editedProduct}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditProductScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");

  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit Prodcut"
      : "Add Product",
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item title="Save" iconName={"md-checkmark"} onPress={submitFn} />
        </HeaderButtons>
      );
    },
  };
};

export default EditProductScreen;

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
