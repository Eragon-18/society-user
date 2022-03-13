import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Header } from "react-native-elements";
import { Card } from "react-native-paper";
import firebase from "firebase";
import Login from "./Login";
import db from "../config";

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: firebase.auth().currentUser.email,
      name: "",
      address: "",
      contact: "",
      password: "",
      secretCode: "",
    };
  }

  getUserDetails() {
    db.collection("users")
      .where("email", "==", this.state.email)
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          this.setState({
            name: doc.data().name,
            secretCode: doc.data().secretCode,
            password: doc.data().password,
          });
        });
      });
  }

  logoutUser = () => {
    try {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.props.navigation.navigate("Login");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
      Alert.alert("An error occured. Please try again later.");
    }
  };

  componentDidMount = () => {
    this.getUserDetails();
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="white"
          centerComponent={{ text: "Settings", style: { fontWeight: "bold" } }}
        />

        <View>
          <Card
            style={{
              height: 130,
              width: 300,
              backgroundColor: "#2C3332",
              marginTop: 10,
            }}
          >
            <Text style={styles.text}>Name: {this.state.name}</Text>
            <Text style={styles.text}>Email: {this.state.email}</Text>
            <Text style={styles.text}>Password: {this.state.password}</Text>
            <Text style={styles.text}>
              Society Code: {this.state.secretCode}
            </Text>
          </Card>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            this.props.navigation.navigate("ContactUs");
          }}
        >
          <Text style={styles.logoutText}>Contact Us</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            this.logoutUser();
          }}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  logoutButton: {
    width: 100,
    height: 50,
    backgroundColor: "#D4A608",
    borderRadius: 10,
    marginTop: 20,
    justifyContent: "center",
  },
  logoutText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
  },
  text: {
    fontWeight: "bold",
    marginTop: 10,
    color: "white",
    marginLeft: 15,
  },
});
