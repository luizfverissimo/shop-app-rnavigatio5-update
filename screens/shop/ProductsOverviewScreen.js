import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Button,
  ActivityIndicator,
  Text,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart";
import * as productsActions from "../../store/actions/products";

import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/colors";

const ProductsOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState()

  const products = useSelector((state) => state.products.availableProducts);
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null)
    setIsRefreshing(true)
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message)
    }
    setIsRefreshing(false)      
  }, [dispatch, setIsRefreshing, setError]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => setIsLoading(false));
  }, [dispatch, loadProducts]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', loadProducts)
    
    return () => {
      willFocusSub.remove()
    }
  }, [loadProducts])

  const selectedItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
    });
  };

  if (error) {
    return (
        <View style={styles.centered}>
          <Text>An error occured.</Text>
          <Button title='Try again' onPress={loadProducts} color={Colors.primary}/>
        </View>
    )
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found. Maybe start adding some.</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() =>
            selectedItemHandler(itemData.item.id, itemData.item.title)
          }
        >
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() =>
              selectedItemHandler(itemData.item.id, itemData.item.title)
            }
          />
          <Button
            color={Colors.primary}
            title="To Cart"
            onPress={() => dispatch(cartActions.addToCart(itemData.item))}
          />
        </ProductItem>
      )}
    />
  );
};

ProductsOverviewScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "All Products",
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
            title="Cart"
            iconName={"md-cart"}
            onPress={() => {
              navData.navigation.navigate("Cart");
            }}
          />
        </HeaderButtons>
      );
    },
  };
};

export default ProductsOverviewScreen;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
