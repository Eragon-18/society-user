import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import firebase from "firebase";
import { Header } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import AddComplaints from "./AddComplaints";
import db from "../config";

export default class Complaints extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      societyEmail: "",
      complaintData: [],
      email: firebase.auth().currentUser.email,
    };
  }

  getData = async () => {
    await db
      .collection("users")
      .where("email", "==", this.state.email)
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          this.setState({
            societyEmail: doc.data().societyEmail,
            secretCode: doc.data().secretCode,
          });
        });
      });
    await db
      .collection("complaints")
      .where("email", "==", this.state.societyEmail)
      .onSnapshot((snapshot) => {
        var complaints = [];
        snapshot.docs.map((doc) => {
          //   console.log(doc.data());
          var complaint = doc.data();
          complaint["docId"] = doc.id;
          if (complaint.complaintType === "bill") {
            complaint["color"] = "blue";
          } else if (complaint.complaintType === "useracts") {
            complaint["color"] = "red";
          } else if (complaint.complaintType === "others") {
            complaint["color"] = "#000000aa";
          } else if (complaint.complaintType === "leakage") {
            complaint["color"] = "yellow";
          }
          complaints.push(complaint);
        });
        this.setState({ complaintData: complaints });
      });
  };

  componentDidMount = () => {
    this.getData();
  };

  renderItem = ({ item }) => {
    return (
      <View style={[styles.flatView, { backgroundColor: item.color }]}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(item.image);
          }}
        >
          <Image
            source={{ uri: item.image }}
            style={{ margin: 10, height: 70, width: 70, borderRadius: 35 }}
          />
        </TouchableOpacity>
        <View style={{ margin: 10, justifyContent: "center", width: 110 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        <View>
          {item.status === false ? (
            <View
              style={{
                backgroundColor: "white",
                alignItems: "center",
                flexDirection: "row",
                height: 20,
                //   alignSelf: 'right',
              }}
            >
              <Ionicons
                name="close-outline"
                size={RFValue(30)}
                color="red"
                style={{ margin: -2 }}
              ></Ionicons>
              <Text
                style={{ textAlign: "right", color: "red", marginRight: 5 }}
              >
                Not resolved
              </Text>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: "white",
                alignItems: "center",
                flexDirection: "row",
                height: 20,
                //   alignSelf: 'right',
              }}
            >
              <Ionicons
                name="checkmark-outline"
                size={RFValue(30)}
                color="green"
                style={{ margin: -2 }}
              ></Ionicons>
              <Text
                style={{ textAlign: "right", color: "green", marginRight: 5 }}
              >
                Resolved
              </Text>
            </View>
          )}
          <Text>
            {item.wing} - {item.flatno}
          </Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="white"
          centerComponent={{
            text: "Complaints",
            style: { fontWeight: "bold" },
          }}
        />
        {this.state.complaintData.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>No complaints yet! Click the + button to add!</Text>
          </View>
        ) : (
          <View>
            <FlatList
              data={this.state.complaintData}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            this.props.navigation.navigate("AddComplaints");
          }}
        >
          <Ionicons name="add-outline" size={RFValue(50)}></Ionicons>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    width: 55,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    top: 470,
    backgroundColor: "#D4A608",
    borderRadius: 30,
    elevation: 8,
  },
  flatView: {
    backgroundColor: "white",
    flexDirection: "row",
    width: "95%",
    margin: 10,
    padding: 5,
    alignSelf: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    color: "white",
  },
  description: {
    fontSize: 12,
    color: "white",
  },
});
