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
const color = ["#59C1BD", "#D6E4E5", "#B3FFAE", "#EB6440"]
// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const DetailFolderScreen: FC<StackScreenProps<AppStackScreenProps, "DetailFolder">> =
  observer(function DetailFolderScreen({ route, navigation }) {
    const { id } = route.params
    const [listFolder, setListFolder] = useState([])
    const [checked, setChecked] = useState(false)
    const [random, setRandom] = useState(0)

    useEffect(() => {
      database()
        .ref(`Folder/${id}/`)
        .once("value", (snapshot) => {
          setListFolder(Object.values(snapshot.val()))

          // setListFolder(listkey)
        })

      return () => {
        setListFolder([])
      }
    }, [])

    return (
      <View style={$root}>
        <View style={{ justifyContent: "center", alignItems: "center", marginTop: 50, marginBottom: 15 }}>
          <Text style={$header}>{id}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 5 }}>
          <Buttontest text="Test" onPress={() => navigation.navigate("Test", { id })} />
          <Buttontest
            text={checked ? "FlashCard" : "List"}
            onPress={() => {
              setChecked(!checked)
              setRandom(Math.floor(Math.random() * color.length))
            }}
          />
        </View>
        <Carousel data={listFolder} checked={checked} color={color[random]} />
      </View>
    )
  })

const $root: ViewStyle = {
  flex: 1,
}
const $header: TextStyle = {
  // marginLeft: 50,
  paddingTop: 40,
  textAlignVertical: "center",
  fontWeight: "bold",
  fontSize: spacing.huge,
  marginBottom: spacing.small,
  textTransform: "capitalize",
}
