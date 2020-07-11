import React from "react";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import {ShopNavigator, AuthNavigator} from '../navigation/ShopNavigator'
import StatupScreen from '../screens/StartupScreen'

const AppNavigator = (props) => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);
  console.log(isAuth)
  console.log(didTryAutoLogin)

  return (
    <NavigationContainer>
      {isAuth && <ShopNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <StatupScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;

/* component utilizado para navegar para a tela de login quando a sessão expirar */
