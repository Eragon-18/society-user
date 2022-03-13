import React, { Component } from "react";
import { StyleSheet } from "react-native";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import { RFValue } from "react-native-responsive-fontsize";
import Ionicons from "react-native-vector-icons/Ionicons";

import Home from "../Screens/Home";
import AddComplaints from "../Screens/AddComplaints";
import Complaints from "../Screens/Complaints";
import Polls from "../Screens/Polls";
import Contacts from "../Screens/Contacts";
import Settings from "../Screens/Settings";
import ContactUs from "../Screens/ContactUs";

const Tab = createMaterialBottomTabNavigator();
function TabNavigator() {
  return (
    <Tab.Navigator
      labeled={false}
      barStyle={styles.bottomTabStyle}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Complaints") {
            iconName = focused ? "alert-circle" : "alert-circle-outline";
          } else if (route.name === "Polls") {
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          } else if (route.name === "Contacts") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }
          return (
            <Ionicons
              name={iconName}
              size={RFValue(25)}
              color={color}
              style={styles.icons}
            />
          );
        },
      })}
      activeColor={"#D4A608"}
      inactiveColor={"gray"}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Complaints" component={ComplaintsStackNavigator} />
      <Tab.Screen name="Polls" component={Polls} />
      <Tab.Screen name="Contacts" component={Contacts} />
      <Tab.Screen name="Settings" component={SettingsStackNavigator} />
    </Tab.Navigator>
  );
}
export default TabNavigator;

const SettingsStack = createStackNavigator();
const SettingsStackNavigator = () => {
  return (
    <SettingsStack.Navigator
      initialRouteName="Settings"
      screenOptions={{ headerShown: false }}
    >
      <SettingsStack.Screen name="Settings" component={Settings} />
      <SettingsStack.Screen name="ContactUs" component={ContactUs} />
    </SettingsStack.Navigator>
  );
};

const ComplaintsStack = createStackNavigator();
const ComplaintsStackNavigator = () => {
  return (
    <ComplaintsStack.Navigator
      initialRouteName="Settings"
      screenOptions={{ headerShown: false }}
    >
      <ComplaintsStack.Screen name="Complaints" component={Complaints} />
      <ComplaintsStack.Screen name="AddComplaints" component={AddComplaints} />
    </ComplaintsStack.Navigator>
  );
};

const styles = StyleSheet.create({
  bottomTabStyle: {
    backgroundColor: "#2C3332",
    height: "8%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    position: "absolute",
  },
  icons: {
    width: RFValue(30),
    height: RFValue(30),
  },
});
