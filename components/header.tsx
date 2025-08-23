import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  return (
    <LinearGradient
      colors={["#eaeaea", "#9898b9"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 p-4"
    >
      <View className="flex-row justify-between items-center">
        {/* Title */}
        <Text className="text-black text-xl font-bold">GAME ON</Text>

        {/* Menu Button */}
        <TouchableOpacity>
          <Text className="text-white text-2xl">☰</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
