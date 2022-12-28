import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  TextStyle,
  View,
  ViewStyle,
  Image,
  ImageStyle,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Screen, Text, TextField } from "../components"
import { spacing } from "../theme"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import { Input, Icon } from "@rneui/themed"
import database from "@react-native-firebase/database"
import auth, { firebase } from "@react-native-firebase/auth"
import { SearchBar } from "@rneui/themed"

const Width = Dimensions.get("window").width
const Height = Dimensions.get("window").height
const avtdefaut = require("../../assets/images/avt.png")
// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const HomeScreen: FC<StackScreenProps<AppStackScreenProps, "Home">> = observer(
  function HomeScreen({ navigation }) {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()
    const [search, setSearch] = useState("")
    const [listFolder, setListFolder] = useState([])
    const [checked, setChecked] = useState(false)
    const [avt, setAvt] = useState("")
    const [filterData, setFilterData] = useState([])

    useEffect(() => {
      database()
        .ref("Folder/")
        .on("value", (snapshot) => {
          const listkey = Object.keys(snapshot.val())
          setListFolder(listkey)
          setFilterData(listkey)
        })
      return () => {
        setFilterData([])
        setListFolder([])
      }
    }, [])
    useEffect(() => {
      database()
        .ref("users/" + auth().currentUser.uid)
        .on("value", (snapshot) => {
          setChecked(snapshot.val().checked)
          setAvt(snapshot.val().photoUrl)
        })
      return () => {
        setChecked(false)
        setAvt("")
      }
    }, [])
    let add
    if (checked == true) {
      add = (
        <TouchableOpacity onPress={() => navigation.navigate("AddFolder")}>
          <FontAwesome5 name="plus-circle" style={$add} />
        </TouchableOpacity>
      )
    } else {
      add = (
        <View
          style={{
            marginTop: 10,
            alignSelf: "center",
            marginBottom: spacing.small,
            marginRight: 25,
          }}
        />
      )
    }
    const searchFilterFunction = (text) => {
      // Check if searched text is not blank
      if (text) {
        // Inserted text is not blank
        // Filter the masterDataSource
        // Update FilteredDataSource
        const newData = listFolder.filter(function (item) {
          const itemData = item ? item.toUpperCase() : "".toUpperCase()
          const textData = text.toUpperCase()
          return itemData.indexOf(textData) > -1
        })
        setFilterData(newData)
        setSearch(text)
      } else {
        // Inserted text is blank
        // Update FilteredDataSource with masterDataSource
        setFilterData(listFolder)
        setSearch(text)
      }
    }

    return (
      <Screen preset="auto" contentContainerStyle={$screenContentContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          {add}
          <Text testID="login-heading" text="E-VOC" preset="heading" style={$signIn} />
          <TouchableOpacity onPress={() => navigation.navigate("DetailUser")}>
            <Image
              style={$avatar}
              source={ {
                uri:  avt,
              } || avtdefaut}
              resizeMode="center"
            ></Image>
          </TouchableOpacity>
        </View>
        <SearchBar
          round={true}
          lightTheme={true}
          containerStyle={{ backgroundColor: "#d9f7cf" }}
          inputContainerStyle={$textField}
          placeholder="Search..."
          autoCapitalize="none"
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
        />
        <FlatList
          data={filterData}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={$viewFolder}
                onPress={() =>
                  navigation.navigate("DetailFolder", {
                    id: item,
                  })
                }
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: "black",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    paddingLeft: 20,
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )
          }}
        />
      </Screen>
    )
  },
)

const $screenContentContainer: ViewStyle = {
  paddingTop: spacing.huge,
  paddingHorizontal: spacing.large,
  backgroundColor: "#d9f7cf",
  flex: 1,
}
const $add: TextStyle = {
  // marginLeft: 50,
  marginTop: 10,
  textAlignVertical: "center",
  fontWeight: "bold",
  fontSize: spacing.extraLarge,
  marginBottom: spacing.small,
  color: "#000",
}
const $signIn: TextStyle = {
  // marginLeft: 50,
  paddingTop: 40,
  textAlignVertical: "center",
  fontWeight: "bold",
  fontSize: spacing.massive,
  marginBottom: spacing.small,
}

const $avatar: ImageStyle = {
  alignSelf: "center",
  height: 50,
  width: 50,
  borderRadius: 25,
  borderWidth: 0.5,
  borderColor: "#FFA717",
}

const $textField: ViewStyle = {
  borderWidth: 1,
  paddingHorizontal: 4,
  borderRadius: 15,
  backgroundColor: "#fff",
}

const $viewFolder: ViewStyle = {
  padding: 8,
  marginVertical: 10,
  marginHorizontal: 10,
  width: Width * 0.82,
  height: Height * 0.12,
  borderWidth: 1,
  backgroundColor: "#ffff",
  borderColor: "#000",
  borderRadius: 16,
  alignItems: "center",
  flexDirection: "row",
}
