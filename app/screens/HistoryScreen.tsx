import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, StyleSheet, FlatList, Image } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Screen, Text } from "../components"
import { Header } from "@rneui/themed"
import Ionicons from "react-native-vector-icons/Ionicons"
import database from "@react-native-firebase/database"
import auth from "@react-native-firebase/auth"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `History: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="History" component={HistoryScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const HistoryScreen: FC<StackScreenProps<AppStackScreenProps, "History">> = observer(
  function HistoryScreen({ navigation }) {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()
    const [list, setList] = useState([])
    useEffect(() => {
      database()
        .ref("History/" + auth().currentUser.uid)
        .on("value", (snapshot) => {
          setList(Object.values(snapshot.val()))
        })
      return () => {
        setList([])
      }
    }, [])

    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <View style={styles.container}>
        <Header
          centerComponent={<Text style={styles.titleHeader}>History Test</Text>}
          backgroundColor={"#4ea9fd"}
          leftComponent={
            <Ionicons
              name="arrow-back"
              color="#000"
              size={28}
              onPress={() => navigation.goBack()}
            />
          }
        />
        <View style={{ flexDirection: "row", justifyContent: "center", margin: 10 }}>
          <Text style={{ fontSize: 20, fontStyle: "italic" }}>
            {auth().currentUser.displayName}
          </Text>
        </View>
        <View style={{ flexDirection: "row", borderWidth: 1 }}>
          <Text style={[styles.text, { flex: 1.5, fontSize: 24 }]}>Name</Text>
          <Text style={[styles.text, { flex: 2, fontSize: 24 }]}>Score</Text>
        </View>
        <FlatList
          data={list}
          renderItem={({ item }) => {
            return (
              <View style={styles.viewHistory}>
                <Text style={[styles.text, { flex: 1.5 }]}>{item.uid}</Text>
                <Text style={[styles.text, { flex: 2, marginLeft: 20 }]}>
                  {item.score} / {item.allQuestions}
                </Text>
              </View>
            )
          }}
        />
      </View>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  viewHistory: { flexDirection: "row", marginVertical: 10 },
  text: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    textTransform: "capitalize",
    paddingLeft: 20,
  },
})
