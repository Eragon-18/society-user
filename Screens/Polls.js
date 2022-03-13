import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import { Header } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import db from "../config";
import firebase from "firebase";
import { RadioButton } from "react-native-paper";

export default class Polls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: firebase.auth().currentUser.email,
      societyEmail: "",
      pollData: [],
      voted: false,
      op1: "",
      op2: "",
      checked: "",
    };
  }
  addVote = async (item) => {
    try {
      var voters = [...item.voters, this.state.email];
      if (this.state.checked === "op1") {
        await db
          .collection("polls")
          .doc(item.docId)
          .update({
            op1voted: firebase.firestore.FieldValue.increment(1),
            voters: voters,
          });
        alert("Vote Registered Successfully");
      } else if (this.state.checked === "op2") {
        await db
          .collection("polls")
          .doc(item.docId)
          .update({
            op2voted: firebase.firestore.FieldValue.increment(1),
            voters: voters,
          });
        alert("Vote Registered Successfully");
      } else {
        alert("Select an option first");
      }
    } catch (e) {
      console.log(e);
      alert(e);
    }
  };
  getPoll = async () => {
    await db
      .collection("users")
      .where("email", "==", this.state.email)

      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          this.setState({
            societyEmail: doc.data().societyEmail,
          });
        });
      });
    await db
      .collection("polls")
      .where("email", "==", this.state.societyEmail)
      .where("completed", "==", false)
      .onSnapshot((snapshot) => {
        var polls = [];
        snapshot.docs.map((doc) => {
          var poll = doc.data();
          poll["docId"] = doc.id;

          if (doc.data().voters.includes(this.state.email)) {
            poll["allowVote"] = false;
          } else {
            poll["allowVote"] = true;
          }
          polls.push(poll);
          console.log(polls);
        });
        this.setState({ pollData: polls });
      });
  };

  componentDidMount = () => {
    this.getPoll();
  };

  renderItem = ({ item }) => {
    return (
      <View style={styles.flatView}>
        <Text style={styles.title}>{item.question}</Text>
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RadioButton
            status={this.state.checked === "op1" ? "checked" : "unchecked"}
            onPress={() => {
              this.setState({ checked: "op1" });
            }}
            disabled={!item.allowVote}
          />
          <Text>{item.op1}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RadioButton
            status={this.state.checked === "op2" ? "checked" : "unchecked"}
            onPress={() => {
              this.setState({ checked: "op2" });
            }}
            disabled={!item.allowVote}
          />
          <Text>{item.op2}</Text>
        </View>

        {item.allowVote ? (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              this.addVote(item);
            }}
          >
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.submitText, { color: "black" }]}>
            Vote Registered
          </Text>
        )}
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="white"
          centerComponent={{
            text: "Polls",
            style: { fontWeight: "bold" },
          }}
        />

        {this.state.pollData.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>No polls yet! Click the + button to create!</Text>
          </View>
        ) : (
          <View>
            <FlatList
              data={this.state.pollData}
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
    backgroundColor: "#D4A608aa",
    width: "95%",
    padding: 5,
    alignSelf: "center",
    marginTop: 10
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: "#000000aa",
    width: "70%",
    height: 50,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  submitText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
    color: "white",
  },
});
