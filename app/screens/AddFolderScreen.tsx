import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  TextStyle,
  View,
  ViewStyle,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Alert,
  FlatList,
  ScrollView,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { ChooseImage, Screen, TextField } from "../components"
import { Header } from "@rneui/themed"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Ionicons from "react-native-vector-icons/Ionicons"
import database from "@react-native-firebase/database"
import uuid from "react-native-uuid"
import RadioForm from "react-native-simple-radio-button"
import de from "date-fns/esm/locale/de/index.js"

const Width = Dimensions.get("window").width
const Height = Dimensions.get("window").height
// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `AddFolder: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="AddFolder" component={AddFolderScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const AddFolderScreen: FC<StackScreenProps<AppStackScreenProps, "AddFolder">> = observer(
  function AddFolderScreen({ navigation }) {
    const [folder, setFolder] = useState<FolderE>()
    const [en, setEn] = useState(folder?.en)
    const [vn, setVn] = useState(folder?.vn)
    const [more, setMore] = useState(folder?.more)
    const [type, setType] = useState(folder?.type)
    // const [idVoc, setIdVoc] = useState(folder?.idVoc)
    const [id, setId] = useState("")
    const [checked, setChecked] = useState(false)
    const [listVoc, setListVoc] = useState<FolderE[]>([])
    const [listVocS, setListVocS] = useState<FolderE[]>([])
    const uid = uuid.v4()
    const [listKey, setListKey] = useState([])

    // let uid = uuid.v4()
    const options = [
      { label: "Noun", value: "Noun" },
      { label: "Verb", value: "Verb" },
      { label: "Adj", value: "Adj" },
      { label: "Adv", value: "Adv" },
      { label: "Pre", value: "Pre" },
    ]
    const addVoc = () => {
      database()
        .ref("Folder/" + id)
        .push()
        .set({
          idVoc: uid,
          vn: vn,
          en: en,
          type: type,
          more: more,
        })
      setEn("")
      setVn("")
      setMore("")
      Alert.alert("", "Vocabulary added", [{ text: "OK" }])
      setListVoc([...listVoc, { idVoc: uid, en: en, type: type, vn: vn, more: more }])
    }
    const addTitle = () => {
      setChecked(true)
      database()
        .ref("Folder/" + id)
        .update({})
    }
    let add
    if (checked == false) {
      add = (
        <View style={{ margin: 10, marginVertical: 15, marginHorizontal: 10 }}>
          <TextInput
            placeholder="Enter a Title"
            style={$input}
            placeholderTextColor="#0A092D"
            onChangeText={(e) => setId(e)}
            value={id}
            editable={!checked == true ? true : false}
          />
          <TouchableOpacity
            onPress={() => addTitle()}
            style={[
              $button,
              {
                backgroundColor: !checked == true ? "#4ea9fd" : "gray",
                width: Width * 0.3,
                marginTop: 10,
                alignSelf:"center"
              },
            ]}
            disabled={!checked == true ? false : true}
          >
            <Text style={{ fontSize: 18, color: "#000", paddingVertical: 8 }}>Add Title</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      add = (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={[$titleHeader, { color: "#FFA717" }]}>{id}</Text>
        </View>
      )
    }
    const deleteVoc = () => {
      try {
        listKey.map((item) => {
          console.log("====================================")
          console.log(item)
          console.log("====================================")
          // database().ref("Folder/" + id + "/" + item).remove()
        })
      } catch (error) {
        console.log(error)
      }
    }
    const cancel = () => {
      if (id === "") {
        navigation.goBack()
      } else {
        Alert.alert("", "Do you want to go back without saving?", [
          {
            text: "Yes",
            onPress: () => {
              database()
                .ref("Folder/" + id)
                .remove()
              navigation.goBack()
            },
          },
          { text: "No", onPress: () => {} },
        ])
      }
    }
    return (
      <Screen style={$root}>
        <Header
          backgroundColor={"#4ea9fd"}
          centerComponent={<Text style={$titleHeader}>Create a new folder</Text>}
          leftComponent={
            <Ionicons
              style={{ marginTop: 5 }}
              name="arrow-back"
              color="#000"
              size={28}
              onPress={() => cancel()}
            />
          }
          rightComponent={
            <Text
              style={{ marginTop: 10, fontSize: 18, fontWeight: "bold", color: "#ffa717" }}
              onPress={() => navigation.goBack()}
            >
              Save
            </Text>
          }
        />
            {add}
        {checked ? (
          <ScrollView>
            <View style={{ borderBottomWidth: 1, marginHorizontal: 10, marginVertical: 5 }} />
            <View
              style={{
                marginBottom: 15,
                marginTop: 10,
                marginHorizontal: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TextInput
                placeholder="Enter a Term"
                style={[$input, { width: Width * 0.45 }]}
                placeholderTextColor="#0A092D"
                onChangeText={(e) => setEn(e)}
                value={en}
              />
              <TextInput
                placeholder="Enter a Definition"
                style={[$input, { width: Width * 0.45 }]}
                placeholderTextColor="#0A092D"
                onChangeText={(e) => setVn(e)}
                value={vn}
              />
            </View>
            <View style={{ width: Width, justifyContent: "center", alignItems: "center" }}>
              <RadioForm
                labelStyle={{ fontSize: 18, color: "#000", marginHorizontal: 8 }}
                labelColor={"#ffa717"}
                labelHorizontal={false}
                formHorizontal={true}
                radio_props={options}
                initial={0}
                obj={type}
                animation={true}
                onPress={(value) => {
                  setType(value)
                }}
              />
            </View>
            <View>
              <TextInput
                placeholder="Enter more information"
                style={[
                  $input,
                  {
                    width: Width * 0.96,
                    marginLeft: 10,
                    height: Height * 0.1,
                    textAlignVertical: "top",
                    maxHeight: Height * 0.15,
                  },
                ]}
                placeholderTextColor="#0A092D"
                onChangeText={(e) => setMore(e)}
                numberOfLines={3}
                multiline={true}
                value={more}
              />
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-around", marginVertical: 15 }}
            >
              <TouchableOpacity
                style={[$button, { backgroundColor: "#4ea9fd" }]}
                onPress={() => addVoc()}
              >
                <Text style={{ fontSize: 18, color: "#ffff", paddingVertical: 8 }}>
                  Add Vocabulary
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[$button, { backgroundColor: "red" }]}
                onPress={() => deleteVoc()}
              >
                <Text style={{ fontSize: 18, color: "#ffff", paddingVertical: 8 }}>Delete</Text>
              </TouchableOpacity>
            </View>
            <View style={{ borderBottomWidth: 1, margin: 10 }} />
            <View style={{ flexDirection: "row" }}>
              <Text style={$text}>Term</Text>
              <Text style={[$text, { paddingLeft: Width * 0.2 }]}>Definition</Text>
              <Text style={[$text, { paddingLeft: Width * 0.1 }]}>Type</Text>
            </View>
          </ScrollView>
        ) : (
          <View></View>
        )}
        <FlatList
          data={listVoc}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={$viewList}
                onPress={() => {
                  setEn(item.en)
                  setVn(item.vn)
                  setType(item.type)
                  // database()
                  // .ref("Folder/" + id)
                  // .on("value", (snapshot) => {
                  //   const listkey = Object.keys(snapshot.val())
                  //   setListKey(listkey)
                  // })
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 20,
                    color: "black",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    paddingLeft: 20,
                    flex: 0.3,
                  }}
                >
                  {item.en}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 20,
                    color: "black",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    paddingLeft: Width * 0.18,
                    flex: 0.4,
                  }}
                >
                  {item.vn}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    color: "black",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    paddingLeft: Width * 0.15,
                    flex: 0.3,
                  }}
                >
                  {item.type}
                </Text>
              </TouchableOpacity>
            )
          }}
        />
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "#fff",
}
const $titleHeader: TextStyle = {
  marginTop: 5,
  fontSize: 24,
  fontWeight: "bold",
  color: "#000",
}
const $input: TextStyle = {
  borderWidth: 1,
  borderRadius: 15,

  paddingHorizontal: 15,
  fontSize: 18,
  color: "#0A092D",
  fontWeight: "bold",
  backgroundColor: "#F6F7FB",
}
const $text: TextStyle = {
  margin: 8,
  paddingHorizontal: 15,
  fontSize: 18,
  color: "#0A092D",
  fontWeight: "bold",
  backgroundColor: "#fff",
}
const $button: ViewStyle = {
  borderRadius: 15,
  borderWidth: 0,
  width: Width * 0.45,
  alignItems: "center",
}
const $viewList: ViewStyle = {
  flexDirection: "row",
  borderWidth: 1,
  borderRadius: 15,
  margin: 5,
  paddingVertical: 5,
}
