import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  ActivityIndicator,
  View,
  Text,
  Button,
  StyleSheet,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";

import { useSelector, useDispatch } from "react-redux";
import * as orderActions from "../../store/actions/order";
import Colors from "../../constants/colors";

const OrdersScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();

  const loadOrders = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(orderActions.fetchOrders());
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [dispatch, setError, setIsLoading]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders, dispatch]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured.</Text>
        <Button title="Try again" onPress={loadOrders} color={Colors.primary} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{fontFamily:'openSans'}} >No orders found, maybe start ordering some products?</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
  );
};

OrdersScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Orders",
    headerLeft: () => {
      return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Menu"
            iconName={"md-menu"}
            onPress={() => {
              navData.navigation.toggleDrawer();
            }}
          />
        </HeaderButtons>
      );
    },
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrdersScreen;
