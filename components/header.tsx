import { View, Text, TouchableOpacity ,Button,StyleSheet} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";


export default function App() {
  return (
    <View>
<Text style={{ fontWeight: "700", fontSize: 25, textAlign: "center", backgroundColor:"white"}}>
  <Text style={{  color: "black" }}>Game </Text>
  <Text style={{ color: "red" }}>On</Text>
</Text>


    <View style={styles.container}>
      <Button title="Profile" color="lightblue" onPress={() => {}} />
      <View style={styles.buttonSpacing}>
        <Button title="Friends" color="lightblue" onPress={() => {}} />
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
});


