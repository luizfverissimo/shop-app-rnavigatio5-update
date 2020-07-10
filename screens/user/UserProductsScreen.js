import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  Button,
  Alert,
  ActivityIndicator,
  View,
  Text,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import Colors from "../../constants/colors";

import * as productsAction from "../../store/actions/products";

const UserProductsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const userProducts = useSelector((state) => state.products.userProducts);
  const dispatch = useDispatch();

  const deleteDispatchHandler = async (id) => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(productsAction.deleteProduct(id));
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

  const deleteHandler = (id) => {
    Alert.alert("Are you sure?", "Do you really want to delete this item?", [
      {
        text: "No",
        style: "default",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => deleteDispatchHandler(id),
      },
    ]);
  };

  const editProductHandler = (id) => {
    props.navigation.navigate("EditProduct", {
      productId: id,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (userProducts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{fontFamily:'openSans'}} >No prodcuts found, maybe start creating some?</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={userProducts}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => {
        return (
          <ProductItem
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            price={itemData.item.price}
            onSelect={() => {
              editProductHandler(itemData.item.id);
            }}
          >
            <Button
              color={Colors.primary}
              title="Edit"
              onPress={() => {
                editProductHandler(itemData.item.id);
              }}
            />
            <Button
              color={Colors.primary}
              title="Delete"
              onPress={() => deleteHandler(itemData.item.id)}
            />
          </ProductItem>
        );
      }}
    />
  );
};

UserProductsScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Products",
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
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Add"
            iconName={"md-create"}
            onPress={() => {
              navData.navigation.navigate("EditProduct");
            }}
          />
        </HeaderButtons>
      );
    },
  };
};

export default UserProductsScreen;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
