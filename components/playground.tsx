import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const Playground = () => {
const[data,setData]=useState([]);

// const getapi=async()=>{
//   const result=await fetch("https://jsonplaceholder.typicode.com/todos");
//   const dat=await result.json();
//   setData(dat);
// }
useEffect(()=>{
const fakeAPI = [
      {
        id: 1,
        title: "Snake Game",
        image: require("../assets/images/snake.png") ,
      },
      {
        id: 2,
        title: "2048",
        image: require("../assets/images/2048.png"),
      },
      {
        id: 3,
        title: "Pac-Man",
        image:  require("../assets/images/2048.png"),
      },
      {
        id: 4,
        title: "Flappy Bird",
        image: require("../assets/images/flappy bird.png"),
      },
        {
        id: 5,
        title: "Snake Game",
        image: "https://i.ibb.co/2nYFqP9/snake.jpg",
      },
      {
        id: 6,
        title: "Chess Master",
        image: "../asse",
      },
      {
        id: 7,
        title: "Pac-Man",
        image: "https://i.ibb.co/6X0t4qG/pacman.jpg",
      },
      {
        id: 8,
        title: "Space Invaders",
        image: "https://i.ibb.co/K9m1b6V/space-invaders.jpg",
      },
        {
        id: 9,
        title: "Pac-Man",
        image: "https://i.ibb.co/6X0t4qG/pacman.jpg",
      },
      {
        id: 10,
        title: "Space Invaders",
        image: "https://i.ibb.co/K9m1b6V/space-invaders.jpg",
      },
    ];

 setTimeout(() => {
      setData(fakeAPI);
    }, 1000);
  }, []);
   
  return (
     

    <ImageBackground
   source={{
    uri: "https://imgs.search.brave.com/Qlm95LwmgLfe00NcjGzSVcydCmLQytMQoojqV-j25E8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/ZWxlZ2FudC13aGl0/ZS1iYWNrZ3JvdW5k/LXdpdGgtc2hpbnkt/bGluZXNfMTAxNy0x/NzU4MC5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQwJnE9ODA"
  }}
 style={styles.background}
  resizeMode="cover"
>   
 <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.wrapContainer}>
  
  { data.map((item)=>(
    <Pressable key={item.id}style={styles.card} >
 <Image source={item.image} style={styles.img} />
       <Text style={styles.title}> {item.title}</Text>
  </Pressable>))}
  </View>
       </ScrollView>
    </ImageBackground>
   
  )
}

export default Playground

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollContent: {
    padding: 12,
  },
  wrapContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",      
    aspectRatio: 1,    
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
  },
  img: {
    flex: 1,            
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.4)", 
    padding: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
});