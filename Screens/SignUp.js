import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import firebase from "firebase";
import db from "../config";

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      secretCode: "",
      wing: "",
      flatno: "",
      name: "",
      showConfirmPassword: false,
      showPassword: false,
      societyEmail: "",
    };
  }

  signUpUser = async () => {
    try {
      await db
        .collection("societies")
        .where("secretCode", "==", this.state.secretCode)
        .get()
        .then((snapshot) => {
          console.log(snapshot.docs);

          if (snapshot.docs.length !== 0) {
            snapshot.docs.map((doc) => {
              this.setState({ societyEmail: doc.data().email });
            });
            firebase
              .auth()
              .createUserWithEmailAndPassword(
                this.state.email,
                this.state.password
              )
              .then((userCredential) => {
                var user = userCredential.user;

                Alert.alert("User Registered Successfully!");

                db.collection("users").add({
                  email: this.state.email,
                  secretCode: this.state.secretCode,
                  societyEmail: this.state.societyEmail,
                  name: this.state.name,
                  wing: this.state.wing,
                  flatno: this.state.flatno,
                  password: this.state.password,
                });

                this.props.navigation.navigate("Home");
              })
              .catch((error) => {
                console.log(error);
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(error);
              });
          } else {
            alert("No such society registered! Entry Valid Society Code");
          }
        });
    } catch (e) {
      console.log(e);
      alert(e);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.registerText}>Register here.</Text>

        <TextInput
          onChangeText={(text) => {
            this.setState({ email: text });
          }}
          style={styles.textInputs}
          placeholder="Your Email Address"
          keyboardType="email-address"
        />

        <TextInput
          onChangeText={(text) => {
            this.setState({ name: text });
          }}
          style={styles.textInputs}
          placeholder="Name"
        />

        <TextInput
          onChangeText={(text) => {
            this.setState({ wing: text });
          }}
          style={styles.textInputs}
          placeholder="Wing"
        />

        <TextInput
          onChangeText={(text) => {
            this.setState({ flatno: text });
          }}
          style={styles.textInputs}
          placeholder="Flat Number"
        />

        <TextInput
          onChangeText={(text) => {
            this.setState({ secretCode: text });
          }}
          style={styles.textInputs}
          placeholder="Society Code"
        />

        <View>
          <TextInput
            style={styles.textInputs2}
            secureTextEntry={this.state.showPassword === false ? true : false}
            placeholder="Password"
            onChangeText={(text) => {
              this.setState({
                password: text,
              });
            }}
          />
          <TouchableOpacity
            style={styles.iconBox}
            onPress={() => {
              if (this.state.showPassword === false) {
                this.setState({ showPassword: true });
              } else if (this.state.showPassword === true) {
                this.setState({ showPassword: false });
              }
            }}
          >
            <Ionicons
              name={this.state.showPassword === false ? "eye-off" : "eye"}
              style={styles.icon}
              size={RFValue(30)}
            ></Ionicons>
          </TouchableOpacity>
        </View>

        <View>
          <TextInput
            style={{
              width: 270,
              height: 35,
              borderWidth: 1.5,
              fontSize: 20,
              margin: 10,
              paddingLeft: 10,
              marginLeft: -5,
              marginTop: 20,
            }}
            secureTextEntry={
              this.state.showConfirmPassword === false ? true : false
            }
            placeholder="Confirm Password"
            onChangeText={(text) => {
              this.setState({
                confirmPassword: text,
              });
            }}
          />
          <TouchableOpacity
            style={styles.iconBox}
            onPress={() => {
              if (this.state.showConfirmPassword === false) {
                this.setState({ showConfirmPassword: true });
              } else if (this.state.showConfirmPassword === true) {
                this.setState({ showConfirmPassword: false });
              }
            }}
          >
            <Ionicons
              name={
                this.state.showConfirmPassword === false ? "eye-off" : "eye"
              }
              style={styles.icon}
              size={RFValue(30)}
            ></Ionicons>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => {
            if (this.state.password === this.state.confirmPassword) {
              this.signUpUser();
              // Alert.alert('Button Pressed!');
            } else {
              Alert.alert("Password and confirmed password do not match.");
            }
          }}
        >
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.login}
          onPress={() => {
            this.props.navigation.navigate("Login");
          }}
        >
          <Text>
            Already Registered?
            <Text style={styles.loginText}> Login</Text>
          </Text>
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
  registerText: {
    fontWeight: "bold",
    marginTop: 40,
    marginLeft: -70,
    width: 250,
    height: 25,
  },
  textInputs: {
    width: 300,
    height: 35,
    borderWidth: 1.5,
    fontSize: 20,
    margin: 10,
    paddingLeft: 10,
    marginLeft: -10,
  },
  textInputs2: {
    width: 270,
    height: 35,
    borderWidth: 1.5,
    fontSize: 20,
    margin: 10,
    paddingLeft: 10,
    marginLeft: -5,
  },
  icon: {
    width: 25,
    height: 35,
    marginTop: 2,
    marginLeft: 5,
    position: "absolute",
  },
  iconBox: {
    width: 40,
    height: 35,
    marginTop: -45,
    marginLeft: 270,
    borderWidth: 2,
  },
  signUpButton: {
    backgroundColor: "#D4A608",
    width: 100,
    height: 50,
    borderRadius: 10,
    marginTop: 40,
    justifyContent: "center",
  },
  signUpText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
  },
  login: {
    marginTop: 20,
    height: 25,
  },
  loginText: {
    fontWeight: "bold",
    color: "#D4A608",
  },
});
