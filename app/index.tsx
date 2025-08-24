import Header from "@/components/header";
import Playground from "@/components/playground";
import { LinearGradient } from "expo-linear-gradient";
import React, {useState}from 'react';
import{View,Button,ScrollView,Image,Text,Modal, StatusBar,ActivityIndicator}from 'react-native';

export default function Index() {

  const [IsModalVisible,setIsModalVisible]=useState(false);

  return (
  <ScrollView style={{backgroundColor:"gradient-lightgrey"}}>
    <Header/>
    <Playground/>
  </ScrollView>
  );
}
