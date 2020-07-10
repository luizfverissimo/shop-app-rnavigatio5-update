import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import CartItem from "../shop/CartItem";
import Colors from "../../constants/colors";
import Card from '../UI/Card'

const OrderItem = (props) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.totalAmount}>$ {props.amount.toFixed(2)}</Text>
        <Text style={styles.date}>{props.date}</Text>
      </View>
      <Button
        color={Colors.primary}
        title={showDetails ? 'Hide Details' : "Show Details"}
        onPress={() => {
          setShowDetails((prevState) => !prevState);
        }}
      />
      {showDetails && (
        <View style={styles.detailItems} >
          {props.items.map((cartItem) => (
            <CartItem
              key={cartItem.productId}
              quantity={cartItem.quantity}
              amount={cartItem.sum}
              title={cartItem.productTitle}
            />
          ))}
        </View>
      )}
    </Card>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  orderItem: {
    padding: 10,
    margin: 20,
    alignItems: "center",
  },

  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },

  totalAmount: {
    fontFamily: "openSansBold",
    fontSize: 16,
  },

  date: {
    fontFamily: "openSans",
    fontSize: 16,
    color: "#888",
  },

  detailItems: {
    width: '100%'
  }
});
