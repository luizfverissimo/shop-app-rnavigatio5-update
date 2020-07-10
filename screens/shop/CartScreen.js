import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import * as cartActions from "../../store/actions/cart";
import * as orderActions from "../../store/actions/order";

import Colors from "../../constants/colors";

import CartItem from "../../components/shop/CartItem";
import Card from "../../components/UI/Card";

const CartScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItems = useSelector((state) => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });

  const dispatch = useDispatch();

  const sendOrderHandler = async () => {
    setIsLoading(true);
    try {
      await dispatch(orderActions.addOrder(cartItems, cartTotalAmount));
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:
          <Text style={styles.amount}>
            {" "}
            $ {Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Button
            title="Order Now"
            color={Colors.price}
            disabled={cartItems.length === 0}
            onPress={sendOrderHandler}
          />
        )}
      </Card>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId}
        renderItem={(itemData) => {
          return (
            <CartItem
              quantity={itemData.item.quantity}
              title={itemData.item.productTitle}
              amount={itemData.item.sum}
              deletable
              onRemove={() => {
                dispatch(cartActions.removerFromCart(itemData.item.productId));
              }}
            />
          );
        }}
      />
    </View>
  );
};

CartScreen.navigationOptions = {
  headerTitle: "Your Cart",
};

export default CartScreen;

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
  },
  summaryText: {
    fontFamily: "openSansBold",
    fontSize: 18,
  },
  amount: {
    color: Colors.price,
  },
});
