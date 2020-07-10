import PRODUCTS from "../../data/dummy-data";
import {
  DELETE_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  SET_PRODUCTS,
} from "../actions/products";
import Product from "../../models/products";

const initialState = {
  availableProducts: [],
  userProducts: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        availableProducts: action.products,
        userProducts: action.userProducts
      }

    case CREATE_PRODUCT:
      const newProduct = new Product(
        action.productData.id,
        action.productData.ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        action.productData.price
      );

      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
      };

    case UPDATE_PRODUCT:
      const productIndex = state.userProducts.findIndex(
        (prod) => prod.id === action.pid
      );

      const upadatedProduct = new Product(
        action.pid,
        state.userProducts[productIndex].ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        state.userProducts[productIndex].price
      );

      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[productIndex] = upadatedProduct;

      const avaliableProductIndex = state.userProducts.findIndex(
        (prod) => prod.id === action.pid
      );
      const updatedAvailableProducts = [...state.availableProducts];
      updatedAvailableProducts[avaliableProductIndex] = upadatedProduct;

      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts,
      };

    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(
          (product) => product.id !== action.pid
        ),
        availableProducts: state.availableProducts.filter(
          (product) => product.id !== action.pid
        ),
      };
  }
  return state;
};
