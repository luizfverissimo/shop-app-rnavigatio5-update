import React, {useEffect} from 'react'
import { StyleSheet, View, ActivityIndicator, AsyncStorage } from 'react-native'
import {useDispatch} from 'react-redux'
import * as authActions from '../store/actions/auth'


import Colors from '../constants/colors'

const StartupScreen = (props) => {
  const dispatch = useDispatch()
useEffect(() => {
  const tryLogin = async () => {
    const userData = await AsyncStorage.getItem('userData')
    if (!userData) {
      props.navigation.navigate('Auth')
      return
    }
    const transformedData = JSON.parse(userData)
    const {token, userId, expiryDate} = transformedData

    const expirationDate = new Date(expiryDate)

    if (expirationDate <= new Date() || !token || !userId) {
      props.navigation.navigate('Auth')
      return
    }

    const expirationTime = expirationDate.getTime() - new Date().getTime()

    props.navigation.navigate('Shop')
    dispatch(authActions.authenticate(userId, token, expirationTime))
  }

  tryLogin()
}, [])

  return (
    <View style={styles.centered}> 
      <ActivityIndicator size='large' color={Colors.primary} />
    </View>
  )
}

export default StartupScreen

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
