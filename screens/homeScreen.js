import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import App from '@/components/header'
import Playground from '@/components/playground'
import { Button } from '@react-navigation/elements'
const homeScreen = ({navigation}) => {
  return (
    <View>
      <Button onPress={()=>navigation.navigate("2048")}>2048</Button>
      <Button onPress={()=>navigation.navigate("Blockoduko")}>Blockoduko</Button>
       <Button onPress={()=>navigation.navigate("PacmanScreen")}>pacman</Button>
      <App/>
      <Playground/>
      
    </View>
  )
}

export default homeScreen

const styles = StyleSheet.create({})