import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { LinearGradient } from "expo-linear-gradient";
const Header = () => {
  return (
    <LinearGradient
  colors={["#ff512f", "#dd2476"]}
  style={styles.headerContainer}
>
  <View style={styles.headerContainer}>
    <Text style={[styles.textWhite, styles.textTitle]}>Game on</Text>
    <TouchableOpacity><Text style={styles.textWhite}>☰</Text></TouchableOpacity>
  </View>
  
</LinearGradient>
  )
}

export default Header

const styles = StyleSheet.create({
  textWhite: {
    color: 'blur',
  },
  textTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerContainer:{
    position:"fixed",
    top:0,
    width:"100%",
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    padding:10,
    borderRadius:4
  }
})