import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ImageBackground, View, ViewStyle, Image, StyleSheet, Dimensions, Alert } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { CustomButton, Screen, Text } from "../components"
import { firebase } from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import database from "@react-native-firebase/database"
import auth from "@react-native-firebase/auth"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Ionicons from "react-native-vector-icons/Ionicons"
import { Header } from "@rneui/themed"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

const Width = Dimensions.get("window").width
const Height = Dimensions.get("window").height
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `DetailUser: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="DetailUser" component={DetailUserScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const DetailUserScreen: FC<StackScreenProps<AppStackScreenProps, "DetailUser">> = observer(
  function DetailUserScreen({ navigation }) {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()
    const [infoUser, setInfoUser] = useState<InfoUser>()
    const user = firebase.auth().currentUser
    useEffect(() => {
      GoogleSignin.configure({
        webClientId: "442457688299-ejuki2n2rvcbelepqkjlak1719m0q4f1.apps.googleusercontent.com",
      })
      database()
        .ref("/users/" + firebase.auth().currentUser.uid)
        .on("value", (snapshot) => setInfoUser(snapshot.val()))
      return () => {
        setInfoUser(undefined)
      }
    }, [])
    const logout = () => {
      Alert.alert("", "Do you want Sign out?", [
        {
          text: "Yes",
          onPress: () => {
            auth().currentUser.providerData[0].providerId == "google.com"
              ? GoogleSignin.signOut().then(() => {
                auth().signOut()
                // navigation.navigate("Login")
              })
              : auth()
                .signOut()
                .then(() => {
                  // navigation.navigate("Login")
                })
          },
        },
        { text: "No", onPress: () => { } },])

    }
    if (infoUser) {
      database()
        .ref("/users/" + firebase.auth().currentUser.uid)
        .update({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          checked: infoUser.checked,
          photoUrl: "http://dayve.vn/wp-content/uploads/2021/11/cach-ve-con-cu-buoc-9.png",
        })
    }
    return (
      <View style={$root}>
        <Header
          backgroundColor={"#4ea9fd"}
          centerComponent={<Text style={styles.titleHeader}>User Profile</Text>}
          rightComponent={<MaterialIcons name="logout" size={24} color="#000" onPress={logout} />}
          leftComponent={
            <Ionicons
              name="arrow-back"
              color="#000"
              size={28}
              onPress={() => navigation.goBack()}
            />
          }
        />
        <View style={styles.content}>
          <ImageBackground
            style={styles.bgImg}
            source={{
              uri: "https://img.freepik.com/free-photo/vocabulary-background-with-school-supplies_23-2149436695.jpg",
            }}
          ></ImageBackground>

          <View style={styles.boxAvt}>
            <Image
              style={styles.avt}
              source={{
                uri: infoUser?.photoUrl,
              }}
            ></Image>
          </View>
          <View style={styles.boxName}>
            <Text style={styles.name}>{user.displayName || infoUser.name}</Text>
          </View>
          <Text style={styles.titleInfor}>Information User</Text>
          <View style={styles.boxInfor}>
            <Text style={styles.textInfor}>{infoUser?.email}</Text>
            <Text style={styles.textInfor}>
              {"Phone Number: "} {infoUser?.phoneNumber}
            </Text>
            <Text style={styles.textInfor}>
              {"Age: "} {infoUser?.birthday == "undefided" ? "" : infoUser?.birthday}{" "}
            </Text>
            <Text style={styles.textInfor}>
              {"Gender: "}
              {infoUser?.gender ? "Male" : "Female"}
            </Text>
            <Text style={styles.textInfor}>
              {"Permission: "}
              {!infoUser?.checked ? "Student" : "Teacher"}
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              marginTop: 15,
              marginBottom: 15,
            }}
          >
            <CustomButton
              title={"Update Proflie"}
              onPress={() => navigation.navigate("UserUpdateProfile", { detailsUser: infoUser })}
            />
            <CustomButton
              title={"History Test"}
              onPress={() => navigation.navigate("History")}
            />
          </View>
        </View>
      </View>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  titleHeader: {
    marginTop: 5,
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },

  boxAvt: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  avt: {
    width: 125,
    height: 125,
    borderRadius: 80,
    borderColor: "#6AD2FD",
    borderWidth: 2,
  },
  boxName: {
    alignItems: "center",
    marginTop: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "500",
  },
  email: {
    fontSize: 16,
    fontStyle: "italic",
  },
  bgImg: {
    borderRadius: 100,
    width: Width,
    height: 150,
    position: "absolute",
  },
  boxHealth: {
    flexDirection: "row",
    height: 180,
    width: Width,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  blood: {
    width: 130,
    height: 130,
    backgroundColor: "#4ea9fd",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.55,
    shadowRadius: 3.84,
    elevation: 8,
  },
  heart: {
    width: 130,
    height: 130,
    backgroundColor: "#4ea9fd",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.55,
    shadowRadius: 4.84,
    elevation: 8,
  },
  titleBlood: {
    fontSize: 16,
    color: "#ffff",
    marginBottom: 10,
    fontWeight: "600",
  },
  textBlood: {
    fontSize: 20,
    color: "#ffff",
    fontWeight: "900",
    marginLeft: 5,
  },
  rowHeartbeat: {
    flexDirection: "row",
    alignItems: "center",
  },
  boxInfor: {
    marginBottom: 8,
    paddingBottom: 30,
    paddingTop: 20,
    flex: 1,
    backgroundColor: "#4ea9fd",
    marginLeft: 35,
    marginRight: 35,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.55,
    shadowRadius: 3.84,

    elevation: 8,
  },
  titleInfor: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "700",
    color: "#4ea9fd",
  },
  textInfor: {
    fontSize: 18,
    color: "#ffff",
    fontWeight: "500",
    alignSelf: "center",
    marginTop: 10,
  },
})
