import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";


export default function App() {
  return (
    <View>
<Text style={{ fontWeight: "700", fontSize: 25, textAlign: "center", backgroundColor:"white"}}>
  <Text style={{  color: "black" }}>Game </Text>
  <Text style={{ color: "red" }}>On</Text>
</Text>


    <View style={styles.container}>
       <TouchableOpacity style={styles.button} onPress={() =>{}}>
      <Text style={styles.text}>Profile</Text>
    </TouchableOpacity>
      <View style={styles.buttonSpacing}>

       <TouchableOpacity style={styles.button} onPress={() => {}}>
      <Text style={styles.text}>Follow</Text>
    </TouchableOpacity>
      </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",     
    justifyContent: "flex-end",
    padding: 10,
    borderRadius:10,
  },
  buttonSpacing: {
    marginLeft: 10,           
  },
  button: {
    borderRadius:25,
    backgroundColor: "grey",
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    
  },
  text: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
export const unstable_settings={
  headerShown:false,
}

