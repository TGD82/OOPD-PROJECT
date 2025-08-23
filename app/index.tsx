import Header from "@/components/header";
import Playground from "@/components/playground";
import { LinearGradient } from "expo-linear-gradient";
import React = require("react");
export default function Index() {
  return (
    <LinearGradient
  colors={["#00F5FF", "#8A2BE2"]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{ padding: 12, borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
    height:"100%"
   }}
>
  <Header/>
  <Playground/>
</LinearGradient>
  );
}
