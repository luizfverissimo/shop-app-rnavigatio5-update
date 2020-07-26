import React, {useState} from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { AppLoading } from 'expo'
import * as Font from 'expo-font'

import ReduxThunk from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import productsReducer from "./store/reducers/products";
import cartReducer from "./store/reducers/cart";
import ordersReducer from './store/reducers/order'
import authReducer from './store/reducers/auth'

import AppNavigator from './navigation/AppNavigator'
import Colors from './constants/colors'




const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk)); 

const fetchFonts = () => {
  return Font.loadAsync({
    'openSans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'openSansBold': require('./assets/fonts/OpenSans-Bold.ttf'),
  })
}

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false)
  if(!fontLoaded) {
    return <AppLoading startAsync={fetchFonts} onFinish={() => setFontLoaded(true)} />
  }

  return (
    <Provider store={store} >
      <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={Colors.primary}
        />
      <AppNavigator />
      </SafeAreaView>
    </Provider>
  );
}
