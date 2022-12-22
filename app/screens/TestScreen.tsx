import React, { FC, useCallback, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  Animated,
  Modal,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  View,
  ViewStyle,
  Image,
  Dimensions,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Screen, Text } from "../components"
import { Header } from "@rneui/themed"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Ionicons from "react-native-vector-icons/Ionicons"
import database from "@react-native-firebase/database"
import auth, { firebase } from "@react-native-firebase/auth"

const Width = Dimensions.get("window").width
const Height = Dimensions.get("window").height

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const TestScreen: FC<StackScreenProps<AppStackScreenProps, "Test">> = observer(
  function TestScreen({ navigation, route }) {
    const { id } = route.params
    const itemRef = database().ref(`Folder`)
    const [allQuestions, setAllQuestions] = useState([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [currentOptionSelected, setCurrentOptionSelected] = useState(null)
    const [correctOption, setCorrectOption] = useState("")
    const [correct, setCorrect] = useState("")
    const [options, setOptions] = useState([])
    const [isOptionsDisabled, setIsOptionsDisabled] = useState(false)
    const [score, setScore] = useState(0)
    const [showNextButton, setShowNextButton] = useState(false)
    const [showScoreModal, setShowScoreModal] = useState(false)
    const [checked, setChecked] = useState(false)
    let today = new Date()
    useEffect(() => {
      itemRef.child(`${id}/`).once("value", (snapshot) => {
        setAllQuestions(Object.values(snapshot.val()))
      })
      database()
        .ref("History/")
        .on("value", (snapshot) => {
          Object.keys(snapshot.val()).map((key) => {
            if (key == auth().currentUser.uid) {
              setChecked(true)
            } else {
              setChecked(false)
            }
          })
        })
      return () => {
        setAllQuestions([])
      }
    }, [])

    useEffect(() => {
      itemRef.child(`${id}/`).on("value", (snapshot) => {
        const data = Object.values(snapshot.val())
        const answerTrue = data[currentQuestionIndex]
        setCorrect(answerTrue["idVoc"])
        const listFalse = data.filter((p) => p["idVoc"] !== answerTrue["idVoc"])
        const mixListFalse = listFalse.sort(() => 0.5 - Math.random())
        const threeAnswerFalse = mixListFalse.slice(0, 3)
        const allAnswer = threeAnswerFalse.concat(answerTrue)
        const allAnswerSort = allAnswer.sort(() => 0.5 - Math.random())
        setOptions(allAnswerSort)
      })
    }, [currentQuestionIndex])

    // cho nao de e check cai dap an

    const validateAnswer = (selectedOption) => {
      setCurrentOptionSelected(selectedOption.idVoc)
      setIsOptionsDisabled(true)
      setCorrectOption(correct)
      if (selectedOption.idVoc == correct) {
        // Set Score
        setScore(score + 1)
      }
      // Show Next Button
      setShowNextButton(true)
    }
    const handleNext = () => {
      if (currentQuestionIndex == allQuestions.length - 1) {
        // Last Question
        // Show Score Modal
        setShowScoreModal(true)
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setCurrentOptionSelected(null)
        setCorrectOption(null)
        setIsOptionsDisabled(false)
        setShowNextButton(false)
      }
      Animated.timing(progress, {
        toValue: currentQuestionIndex + 1,
        duration: 1000,
        useNativeDriver: false,
      }).start()
    }
    const restartQuiz = () => {
      setShowScoreModal(false)

      setCurrentQuestionIndex(0)
      setScore(0)

      setCurrentOptionSelected(null)
      setCorrectOption(null)
      setIsOptionsDisabled(false)
      setShowNextButton(false)
      Animated.timing(progress, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
      }).start()
    }

    const renderQuestion = () => {
      return (
        <View
          style={{
            marginVertical: 40,
          }}
        >
          {/* Question Counter */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <Text style={{ color: "#ffff", fontSize: 20, opacity: 0.6, marginRight: 2 }}>
              {currentQuestionIndex + 1}
            </Text>
            <Text style={{ color: "#ffff", fontSize: 18, opacity: 0.6 }}>
              / {allQuestions.length}
            </Text>
          </View>

          {/* Question */}
          <Text
            style={{
              color: "#ffff",
              fontSize: 30,
              paddingLeft: 10,
              paddingTop: 20,
            }}
          >
            {allQuestions[currentQuestionIndex]?.en}
          </Text>
        </View>
      )
    }
    const renderOptions = () => {
      return (
        <View>
          {options.map((option) => (
            <TouchableOpacity
              onPress={() => {
                validateAnswer(option)
              }}
              disabled={isOptionsDisabled}
              key={option.vn}
              style={{
                borderWidth: 3,
                borderColor:
                  option.idVoc == correctOption
                    ? "#00C851" + "40"
                    : option.idVoc == currentOptionSelected
                    ? "#ff4444" + "40"
                    : "#1E90FF" + "40",
                backgroundColor:
                  option.idVoc == correctOption
                    ? "#00C851" + "20"
                    : option.idVoc == currentOptionSelected
                    ? "#ff4444" + "20"
                    : "#1E90FF" + "20",
                height: 60,
                borderRadius: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                marginVertical: 10,
              }}
            >
              <Text style={{ fontSize: 20, color: "#ffff" }}>{option.vn}</Text>

              {/* Show Check Or Cross Icon based on correct answer*/}
              {option.idVoc == correctOption ? (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 30 / 2,
                    backgroundColor: "#00C851",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="check"
                    style={{
                      color: "#ffff",
                      fontSize: 20,
                    }}
                  />
                </View>
              ) : option.idVoc == currentOptionSelected ? (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 30 / 2,
                    backgroundColor: "#ff4444",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="close"
                    style={{
                      color: "#ffff",
                      fontSize: 20,
                    }}
                  />
                </View>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      )
    }
    const renderNextButton = () => {
      if (showNextButton) {
        return (
          <TouchableOpacity
            onPress={handleNext}
            style={{
              marginTop: 20,
              width: "100%",
              backgroundColor: "#3498db",
              padding: 20,
              borderRadius: 5,
            }}
          >
            <Text style={{ fontSize: 20, color: "#ffff", textAlign: "center" }}>Next</Text>
          </TouchableOpacity>
        )
      } else {
        return null
      }
    }

    const [progress, setProgress] = useState(new Animated.Value(0))
    const progressAnim = progress.interpolate({
      inputRange: [0, allQuestions.length],
      outputRange: ["0%", "100%"],
    })
    const renderProgressBar = () => {
      return (
        <View
          style={{
            width: "100%",
            height: 20,
            borderRadius: 20,
            backgroundColor: "#00000020",
          }}
        >
          <Animated.View
            style={[
              {
                height: 20,
                borderRadius: 20,
                backgroundColor: "#3498db",
              },
              {
                width: progressAnim,
              },
            ]}
          ></Animated.View>
        </View>
      )
    }
    const save = () => {
      if (checked == true) {
        database()
          .ref("History/" + auth().currentUser.uid)
          .push()
          .set({
            uid: id,
            score: score,
            allQuestions: allQuestions.length,
            date: today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear()
          })
      }
      else{
        database()
          .ref("History/" + auth().currentUser.uid)
          .update({})
        database()
          .ref("History/" + auth().currentUser.uid)
          .push()
          .set({
            uid: id,
            score: score,
            allQuestions: allQuestions.length,
            date: today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear()
          })
      }
    }
    return (
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <StatusBar barStyle="light-content" backgroundColor={"#252c4a"} />
        <View
          style={{
            flex: 1,
            paddingVertical: 40,
            paddingHorizontal: 16,
            backgroundColor: "#252C4A",
            position: "relative",
          }}
        >
          {/* ProgressBar */}
          {renderProgressBar()}

          {/* Question */}
          {renderQuestion()}

          {/* Options */}
          {renderOptions()}

          {/* Next Button */}
          {renderNextButton()}

          {/* Score Modal */}
          <Modal animationType="slide" transparent={true} visible={showScoreModal}>
            <View
              style={{
                flex: 1,
                backgroundColor: "#252c4a",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#ffff",
                  width: "90%",
                  borderRadius: 20,
                  padding: 20,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 30, fontWeight: "bold", paddingTop: 10 }}>
                  {score > allQuestions.length / 2 ? "Congratulations!" : "Oops!"}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginVertical: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      paddingTop: 15,
                      color: score > allQuestions.length / 2 ? "#00C851" : "#ff4444",
                    }}
                  >
                    {score}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      color: "#171717",
                    }}
                  >
                    / {allQuestions.length}
                  </Text>
                </View>
                {/* Retry Quiz button */}
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={restartQuiz}
                    style={{
                      backgroundColor: "#3498db",
                      padding: 20,
                      width: "50%",
                      marginRight: 5,
                      borderRadius: 20,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#ffff",
                        fontSize: 20,
                      }}
                    >
                      Retry Quiz
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      save()
                      navigation.navigate("Home")
                    }}
                    style={{
                      backgroundColor: "#3498db",
                      padding: 20,
                      width: "50%",
                      marginLeft: 5,
                      borderRadius: 20,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#ffff",
                        fontSize: 20,
                      }}
                    >
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Background Image */}
          <Image
            source={{
              uri: "https://raw.githubusercontent.com/RushikeshVidhate/react-native-quiz-app/master/app/assets/images/DottedBG.png",
            }}
            style={{
              width: Width,
              height: 130,
              zIndex: -1,
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              opacity: 0.5,
            }}
            resizeMode={"contain"}
          />
        </View>
      </SafeAreaView>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
