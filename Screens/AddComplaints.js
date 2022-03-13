import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  Button,
  Alert,
  TouchableOpacity,
  Picker,
} from "react-native";
import {
  FontAwesome5,
  FontAwesome,
  Entypo,
  Ionicons,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import * as Font from "expo-font";
import firebase from "firebase";
import { Avatar, Header } from "react-native-elements";

import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Modal from "react-native-modal";
import db from "../config";

export default class AddComplaints extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      cameraPermissions: "",
      modalVisible: false,
      image: "https://dummyimage.com/600x400/000/d4a408&text=++Image++",
      userEmail: firebase.auth().currentUser.email,
      resolved: false,
      societyEmail: "",
      complaintType: "",
      wing: "",
      flatno: "",
    };
  }

  getSocietyEmail = () => {
    db.collection("users")
      .where("email", "==", this.state.userEmail)
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          this.setState({
            societyEmail: doc.data().societyEmail,
            wing: doc.data().wing,
            flatno: doc.data().flatno,
          });
        });
        //  console.log(this.state.societyEmail);
      });
  };

  takePhotoFromCamera = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      cameraPermissions: status === "granted",
    });
    if (this.state.cameraPermissions) {
      await ImagePicker.launchCameraAsync({
        compressImageMaxWidth: 290,
        compressImageMaxHeight: 290,
        cropping: true,
        compressImageQuality: 0.9,
      }).then((image) => {
        this.setState({ image: image.uri });
        this.setState({
          modalVisible: false,
        });
      });
    } else {
      return alert("Permissions Not Granted").then(() => {
        this.setState({
          modalVisible: false,
        });
      });
    }
  };

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    this.setState({
      modalVisible: false,
    });
    if (!cancelled) {
      this.setState({ image: uri });
      console.log("Worked" + this.state.image);
      this.setState({
        modalVisible: false,
      });
    }
  };

  fetchImage = (uniqueId) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("ComplaintImages/" + this.state.userEmail + "/" + uniqueId);
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
        db.collection("complaints").add({
          email: this.state.societyEmail,
          title: this.state.title,
          description: this.state.description,
          image: url,
          uniqueId: uniqueId,
          status: this.state.resolved,
          complaintType: this.state.complaintType,
          wing: this.state.wing,
          flatno: this.state.flatno,
        });
        //  console.log('Successful');

        this.setState({
          image: "https://dummyimage.com/600x400/000/d4a408&text=++Image++",
          title: "",
          description: "",
        });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  createUniqueId = () => {
    return Math.random().toString(36).substring(7);
  };

  addDetails = async () => {
    if (
      this.state.title &&
      this.state.description &&
      this.state.image &&
      this.state.complaintType
    ) {
      var uniqueId = this.createUniqueId();

      var response = await fetch(this.state.image);
      var blob = await response.blob();

      var ref = firebase
        .storage()
        .ref()
        .child("ComplaintImages/" + this.state.userEmail + "/" + uniqueId);
      ref.put(blob).then((response) => {
        this.fetchImage(uniqueId);
      });
      Alert.alert("Complaint successfully created!");
      this.props.navigation.navigate("Complaints");
    } else {
      alert(
        "All fields are required. Make sure you have selected the complaint type."
      );
    }
  };

  componentDidMount() {
    this.getSocietyEmail();
    //console.log('hi');
  }

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView />
        <Header
          backgroundColor="white"
          centerComponent={{
            text: "Add Complaint",
            style: { fontWeight: "bold" },
          }}
          leftComponent={{
            text: "< Back",
            onPress: () => {
              this.props.navigation.navigate("Complaints");
            },
          }}
        />
        <View>
          <Modal
            style={styles.modalView}
            isVisible={this.state.modalVisible}
            backdropOpacity={0.4}
            deviceWidth={Dimensions.get("window").width}
            deviceHeight={Dimensions.get("window").height}
            onBackdropPress={() => this.setState({ modalVisible: false })}
          >
            <View style={styles.modalMainView}>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: -13,
                  right: -10,
                  margin: 10,
                  padding: 10,
                }}
                onPress={() => this.setState({ modalVisible: false })}
              >
                <MaterialIcons
                  name="cancel"
                  size={24}
                  color="#D4A608ff"
                  onPress={() => this.setState({ modalVisible: false })}
                />
              </TouchableOpacity>
              <Text style={{ textAlign: "center", margin: 5, padding: 5 }}>
                Choose An Option
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignSelf: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.takePhotoFromCamera();
                  }}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10,
                  }}
                >
                  <Feather
                    name="camera"
                    size={24}
                    color="#D4A608ff"
                    onPress={() => this.setState({ modalVisible: false })}
                  />
                  <Text style={{ textAlign: "center" }}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.selectPicture();
                  }}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10,
                  }}
                >
                  <FontAwesome
                    name="photo"
                    size={24}
                    color="#D4A608ff"
                    onPress={() => this.setState({ modalVisible: false })}
                  />
                  <Text style={{ textAlign: "center" }}>Photos</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        <View style={styles.fieldsContainer}>
          <ScrollView
            contentContainerStyle={{ alignItems: "center" }}
            style={{ marginBottom: 50 }}
          >
            <Avatar
              rounded
              size="large"
              source={{
                uri: this.state.image,
              }}
              onPress={() => {
                this.setState({ modalVisible: true });
              }}
              containerStyle={{
                alignSelf: "center",
                margin: 20,
              }}
            />

            <View style={{ marginHorizontal: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    padding: 5,
                    margin: 10,
                    backgroundColor:
                      this.state.complaintType === "useracts"
                        ? "white"
                        : "#0000ffaa",
                    borderRadius: 5,
                  }}
                  onPress={() => this.setState({ complaintType: "useracts" })}
                >
                  <Text
                    style={{
                      color:
                        this.state.complaintType === "useracts"
                          ? "#0000ffaa"
                          : "white",
                    }}
                  >
                    Other Member Activities
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    padding: 5,
                    margin: 10,
                    backgroundColor:
                      this.state.complaintType === "leakage"
                        ? "white"
                        : "#00ff00aa",
                    borderRadius: 5,
                  }}
                  onPress={() => this.setState({ complaintType: "leakage" })}
                >
                  <Text
                    style={{
                      color:
                        this.state.complaintType === "leakage"
                          ? "#00ff00aa"
                          : "white",
                    }}
                  >
                    Leakage/Construction
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    padding: 5,
                    margin: 10,
                    backgroundColor:
                      this.state.complaintType === "bill"
                        ? "white"
                        : "#ff0000aa",
                    borderRadius: 5,
                  }}
                  onPress={() => this.setState({ complaintType: "bill" })}
                >
                  <Text
                    style={{
                      color:
                        this.state.complaintType === "bill"
                          ? "#ff0000aa"
                          : "white",
                    }}
                  >
                    Bill/Rent
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    padding: 5,
                    margin: 10,
                    backgroundColor:
                      this.state.complaintType === "others"
                        ? "white"
                        : "#000000aa",
                    borderRadius: 5,
                  }}
                  onPress={() => this.setState({ complaintType: "others" })}
                >
                  <Text
                    style={{
                      color:
                        this.state.complaintType === "others"
                          ? "#000000aa"
                          : "white",
                    }}
                  >
                    Others
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.inputFont}
                onChangeText={(title) => this.setState({ title })}
                placeholder={"Title"}
                value={this.state.title}
              />
              <TextInput
                style={[styles.inputFont, { height: 90 }]}
                onChangeText={(description) => this.setState({ description })}
                placeholder={"Description"}
                multiline={true}
                numberOfLines={4}
                value={this.state.description}
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                this.addDetails();
              }}
            >
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  fieldsContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
    margin: 10,
  },
  inputFont: {
    width: 300,
    height: 35,
    borderWidth: 1.5,
    fontSize: 20,
    margin: 10,
    paddingLeft: 10,
  },
  modalView: {
    alignSelf: "center",
    borderColor: "#bbbb",
    width: "60%",
    height: "60%",
  },
  modalMainView: {
    backgroundColor: "#ffff",
    borderRadius: 10,
    shadowOffset: {
      width: 2,
      height: 10,
    },
    shadowColor: "#bbbb",
  },
  submitButton: {
    backgroundColor: "#D4A608",
    width: 100,
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
  },
});
