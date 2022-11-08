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

const Width = Dimensions.get("window").width
const Height = Dimensions.get("window").height
// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const HomeScreen: FC<StackScreenProps<AppStackScreenProps, "Home">> = observer(
  function HomeScreen({ navigation }) {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()
    const [search, setSearch] = useState("")
    const [listFolder, setListFolder] = useState([])

    useEffect(() => {
      database()
        .ref("Folder/")
        .on("value", (snapshot) => {
          const listkey = Object.keys(snapshot.val())
          setListFolder(listkey)
        })
      return () => {
        setListFolder([])
      }
    }, [])

    return (
      <Screen
        preset="fixed"
        contentContainerStyle={$screenContentContainer}

        // safeAreaEdges={["top", "bottom"]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Text testID="login-heading" text="E-VOC" preset="heading" style={$signIn} />
          <TouchableOpacity>
            <Image
              style={$avatar}
              source={{
                uri: "data:image/png;base64,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",
              }}
              resizeMode="center"
            ></Image>
          </TouchableOpacity>
        </View>
        <Input
          placeholder="Search"
          leftIcon={{ type: "font-awesome", name: "search" }}
          inputContainerStyle={$textField}
        />

        <FlatList
          // style={{ width: 200, height: 200 }}
          data={listFolder}
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
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
  backgroundColor: "#d9f7cf",
  flex: 1,
}

const $signIn: TextStyle = {
  marginLeft: 50,
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
