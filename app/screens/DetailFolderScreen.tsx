import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, TextStyle, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Carousel, Screen, Text } from "../components"
import database from "@react-native-firebase/database"
import { Buttontest } from "../components/Buttontest"
import { spacing } from "../theme"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"
const Width = Dimensions.get("window").width
const Height = Dimensions.get("window").height
// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `DetailFolder: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="DetailFolder" component={DetailFolderScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const DetailFolderScreen: FC<StackScreenProps<AppStackScreenProps, "DetailFolder">> =
  observer(function DetailFolderScreen({ route, navigation }) {
    const { id } = route.params
    console.log(id)
    const [listFolder, setListFolder] = useState([])

    useEffect(() => {
      database()
        .ref(`Folder/${id}/`)
        .once("value", (snapshot) => {
          setListFolder(Object.values(snapshot.val()))
          console.log(listFolder)

          // setListFolder(listkey)
        })
      return () => {
        setListFolder([])
      }
    }, [])

    return (
      <Screen style={$root} preset="scroll">
        <View style={{justifyContent: "center", alignItems: "center", marginVertical: 15,}}>
          <Text style={$header}>{id}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Buttontest text="Test" />
          <Buttontest text="Learn" />
          <Buttontest text="Listen" />
        </View>
        <Carousel data={listFolder} />
      </Screen>
    )
  })

const $root: ViewStyle = {
  flex: 1,
  paddingTop: Height * 0.05,
}
const $header: TextStyle = {
  // marginLeft: 50,
  paddingTop: 40,
  textAlignVertical: "center",
  fontWeight: "bold",
  fontSize: spacing.huge,
  marginBottom: spacing.small,
  textTransform: "capitalize"
}
