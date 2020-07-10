import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CartItem = (props) => {
  return (
    <View style={styles.cartItem}>
      <View style={styles.itemData}>
        <Text style={styles.quantity}>{props.quantity} - </Text>
        <Text style={styles.mainText}>{props.title}</Text>
      </View>
      <View style={styles.itemData}>
        <Text style={styles.mainText}>$ {props.amount.toFixed(2)}</Text>
        {props.deletable && (
          <TouchableOpacity
            onPress={props.onRemove}
            style={styles.deleteButton}
          >
            <Ionicons name="md-trash" size={23} color="red" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  cartItem: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  itemData: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantity: {
    fontFamily: "openSans",
    color: "#888",
    fontSize: 16,
  },
  mainText: {
    fontFamily: "openSansBold",
    fontSize: 16,
  },
  deleteButton: {
    marginLeft: 20,
  },
});
