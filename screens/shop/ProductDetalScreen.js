import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ScrollView,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import * as cartActions from '../../store/actions/cart'

import Colors from '../../constants/colors'

const ProductDetalScreen = (props) => {
  const productId = props.route.params.productId;
  const selectedProduct = useSelector((state) =>
    state.products.availableProducts.find((product) => product.id === productId)
  );

  const dispatch = useDispatch()

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.actions} > 
      <Button color={Colors.primary} title="Add to Cart" onPress={() => dispatch(cartActions.addToCart(selectedProduct))}/>
      </View>
      <Text style={styles.price}>$ {selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: navData.route.params.productTitle
  };
};

export default ProductDetalScreen;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300
  },

  actions: {
    marginVertical: 10,
    alignItems: 'center'
  },

  price: {
    fontFamily: 'openSansBold',
    fontSize: 20,
    color: Colors.price,
    textAlign: 'center',
    marginVertical: 20,
  },

  description: {
    fontFamily: 'openSans',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20
  }

});
