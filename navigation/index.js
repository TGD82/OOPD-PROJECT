import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import homeScreen from "../screens/homeScreen";


const Stack = createNativeStackNavigator();
const StackNavigatorContainer =()=>{
    return (
    <Stack.Navigator >
        <Stack.Screen name="Home" component={homeScreen} />
    </Stack.Navigator>
    )
}
const Navigation = () => {
  return (
    <StackNavigatorContainer/>
   );
}
export default Navigation

