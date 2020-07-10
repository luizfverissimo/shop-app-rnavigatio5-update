import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";

import Colors from '../../constants/colors'
import Card from '../UI/Card'


const ProductItem = (props) => {
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  return (
    <Card style={styles.product}>
      <View style={styles.touchable}>
        <TouchableComp onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: props.image }} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{props.title}</Text>
              <Text style={styles.price}>$ {props.price.toFixed(2)}</Text>
            </View>
            <View style={styles.actions}>
              {props.children}
            </View>
          </View>
        </TouchableComp>
      </View>
    </Card>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  product: {
    height: 300,
    margin: 20,
  },
  touchable: {
    borderRadius: 10,
    overflow: "hidden",
  },

  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  textContainer: {
    alignItems: "center",
    height: "15%",
    padding: 10,
  },

  title: {
    fontFamily: 'openSansBold',
    fontSize: 18,
    marginVertical: 2,
  },

  price: {
    fontFamily: 'openSansBold',
    fontSize: 14,
    color: Colors.price
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "25%",
    paddingHorizontal: 20,
  },
});
