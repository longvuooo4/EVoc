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
    const [random, setRandom] = useState(0)
    const color = ["#59C1BD", "#D6E4E5", "#B3FFAE", "#EB6440"]
    useEffect(() => {
      database()
        .ref("History/" + auth().currentUser.uid)
        .orderByChild("date")
        .on("value", (snapshot) => {
          if (snapshot.val()) {
            setList(Object.values(snapshot.val()))
          }
          else{
            setList([])
          }
        })
      setRandom(Math.floor(Math.random() * color.length))
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
        <View style={[{ flexDirection: "row" }, styles.viewHistory]}>
          <Text style={[styles.text, { fontSize: 24, flex: 1 }]}>Name</Text>
          <Text style={[styles.text, { fontSize: 24, flex: 1 }]}>Score</Text>
          <Text style={[styles.text, { fontSize: 24, flex: 1 }]}>Date</Text>
        </View>
        <FlatList
          data={list}
          renderItem={({ item }) => {
            return (
              <View style={[styles.viewHistory, { backgroundColor: color[random] }]}>
                <Text style={[styles.text, { flex: 1 }]}>{item.uid}</Text>
                <Text style={[styles.text, { flex: 1 }]}>
                  {item.score} / {item.allQuestions}
                </Text>
                <Text style={[styles.text, { flex: 1 }]}>{item.date}</Text>
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
  viewHistory: {
    justifyContent: "space-around",
    flexDirection: "row",
    marginVertical: 10,
    borderWidth: 1,
    paddingVertical: 10,
    width: "95%",
    marginLeft: 10,
    borderRadius: 50,
  },
  text: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    textTransform: "capitalize",
    paddingLeft: 20,
  },
})
