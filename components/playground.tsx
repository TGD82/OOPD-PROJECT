import { StyleSheet, Text, View ,Pressable,Image,ScrollView } from 'react-native'
import React from 'react'

const Playground = () => {
    const images = Array.from({ length: 10 }, (_, i) => i);
  return (
    <View style={{display:"flex",flexWrap:"wrap",flexDirection:"row"}}>
      
      {images.map((item, index) => (
        <Pressable>
        <Image key={item}source={require('../images/icon.jpg')} style={styles.img}/>
      </Pressable>
      ))}
    </View>
  )
}

export default Playground

const styles = StyleSheet.create({
    img:{
        height:80,
        width:80,
        margin:15,
        borderRadius:4,
        borderWidth:3,
        borderBlockColor:"white"
    }
})