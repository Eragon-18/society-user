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
import db from "../config";

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      secretCode: "",
      societyEmail: "",
      announcementData: [],
      email: firebase.auth().currentUser.email,
    };
  }

  getUserDetails = async () => {
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
      .collection("announcements")
      .where("email", "==", this.state.societyEmail)
      .onSnapshot((snapshot) => {
        var announcements = [];
        snapshot.docs.map((doc) => {
          //   console.log(doc.data());
          var announcement = doc.data();
          announcement["docId"] = doc.id;
          if (announcement.announcementType === "celebrations") {
            announcement["color"] = "blue";
          } else if (announcement.announcementType === "meetings") {
            announcement["color"] = "red";
          } else if (announcement.announcementType === "others") {
            announcement["color"] = "#000000aa";
          } else if (announcement.announcementType === "polls") {
            announcement["color"] = "yellow";
          }
          announcements.push(announcement);
        });
        this.setState({ announcementData: announcements });
      });
  };

  componentDidMount() {
    this.getUserDetails();
  }

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
        <View style={{ margin: 10, justifyContent: "center" }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
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
            text: "Home",
            style: { fontWeight: "bold" },
          }}
        />
        {this.state.announcementData.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>No announcements yet! Click the + to start adding</Text>
          </View>
        ) : (
          <View>
            <FlatList
              data={this.state.announcementData}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
