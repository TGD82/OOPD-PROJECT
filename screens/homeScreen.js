import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import App from '@/components/header'
import Playground from '@/components/playground'
const homeScreen = () => {
  return (
    <View>
      <App/>
      <Playground/>
    </View>
  )
}

export default homeScreen

const styles = StyleSheet.create({})