import React, { FC, useEffect, useLayoutEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, Dimensions, TextStyle, TouchableOpacity, View, ViewStyle, Image, ImageStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Button, ButtonSocial, Header, Screen, Text, TextField } from "../components"
import { colors, spacing } from "../theme"
import auth, { firebase } from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"
import { RadioButton } from "react-native-paper"
import Ionicons from "react-native-vector-icons/Ionicons"
import { Input } from "@rneui/themed"
const Width = Dimensions.get("window").width

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `Signup: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="Signup" component={SignupScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const SignupScreen: FC<StackScreenProps<AppStackScreenProps, "Signup">> = observer(
  function SignupScreen({ navigation }) {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()
    const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
    const [isAuthPasswordRepeatHidden, setIsAuthPasswordRepeatHidden] = useState(true)
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [passwordRepeat, setPasswordRepeat] = useState("")
    const [checked, setChecked] = useState(false)
    const onGoBackPress = () => {
      navigation.goBack()
    }
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: true,
        header: () => <Header leftIcon="back" onLeftPress={onGoBackPress} />,
      })
    }, [])
    const resetForm = () => {
      setEmail("")
      setPassword("")
      setPasswordRepeat("")
      setName("")
    }

    const onRegisterPressed = async () => {
      if (!email || !password || !passwordRepeat || !name) {
        Alert.alert("", "Can't be empty")
      } else if (password != passwordRepeat) {
        Alert.alert("", "Incorrect re-password")
        setPassword("")
        setPasswordRepeat("")
      } else if (password === passwordRepeat) {
        try {
          await auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => { })
            .then(() => {
              console.log("Register with:" + email)
            })
            .catch((e) => {
              if (e.code === "auth/email-already-in-use") {
                Alert.alert("", "That email address is already in use!")
              }

              if (e.code === "auth/invalid-email") {
                Alert.alert("", "That email address is invalid!")
              }
              console.log("There has been a problem with your fetch operation: " + e.message)
            })

          await auth()
            .currentUser.updateProfile({ displayName: name })
            .then(() => {
              database()
                .ref("/users/" + auth().currentUser.uid)
                .set({
                  uid: auth().currentUser.uid,
                  name: auth().currentUser.displayName,
                  email: auth().currentUser.email,
                  phoneNumber: auth().currentUser.phoneNumber,
                  checked,
                })
                .then(() => {
                  Alert.alert("Register successful", `Congratulations ${name} has successfully registered`)

                  resetForm()
                })
            })
        } catch (e) { }
      }
      // navigation.navigate('confirmemail')
    }

    return (
      <Screen
        preset="auto"
        contentContainerStyle={$screenContentContainer}
        safeAreaEdges={["bottom"]}
      >
        <Image source={require('../../assets/images/EVoc.png')} style={$img} />
        <Input
          placeholder="Email"
          leftIcon={<Ionicons name="mail" size={24} color="gray" />}
          keyboardType="email-address"
          value={email}
          onChangeText={(e) => setEmail(e)}
        />
        <Input
          placeholder="Name"
          leftIcon={<Ionicons name="person-circle-outline" size={24} color="gray" />}
          keyboardType="default"
          value={name}
          onChangeText={(e) => setName(e)}
        />
        <Input
          secureTextEntry={isAuthPasswordHidden}
          placeholder="Password"
          leftIcon={<Ionicons name="lock-closed" size={24} color="gray" />}
          value={password}
          onChangeText={(p) => setPassword(p)}
          rightIcon={
            !password ? (
              <View />
            ) : (
              <Ionicons
                name={isAuthPasswordHidden ? "eye" : "eye-off"}
                size={24}
                color="gray"
                onPress={() => {
                  setIsAuthPasswordHidden(!isAuthPasswordHidden)
                }}
              />
            )
          }
        />
        <Input
          secureTextEntry={isAuthPasswordRepeatHidden}
          placeholder="Confirm Password"
          leftIcon={<Ionicons name="lock-closed" size={24} color="gray" />}
          value={passwordRepeat}
          onChangeText={(p) => setPasswordRepeat(p)}
          rightIcon={
            !passwordRepeat ? (
              <View />
            ) : (
              <Ionicons
                name={isAuthPasswordRepeatHidden ? "eye" : "eye-off"}
                size={24}
                color="gray"
                onPress={() => {
                  setIsAuthPasswordRepeatHidden(!isAuthPasswordRepeatHidden)
                }}
              />
            )
          }
        />
        <Text style={{ fontWeight: "700", fontSize: 16, marginHorizontal: 10 }}>You are?</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 10 }}>
          <View style={$radioButton}>
            <Text>Teacher</Text>
            <RadioButton
              color="#000"
              value="Teacher"
              status={checked === true ? "checked" : "unchecked"}
              onPress={() => setChecked(true)}
            />
          </View>
          <View style={$radioButton}>
            <Text>Student</Text>
            <RadioButton
              color="#000"
              value="Student"
              status={checked === false ? "checked" : "unchecked"}
              onPress={() => setChecked(false)}
            />
          </View>
        </View>
        <Button
          testID="login-button"
          text="Tap to sign up"
          style={$tapButton}
          preset="reversed"
          onPress={onRegisterPressed}
        />
      </Screen>
    )
  },
)

const $screenContentContainer: ViewStyle = {
  paddingBottom: spacing.huge,
  paddingHorizontal: spacing.large,
}
const $img: ImageStyle = {
  height: 250,
  width: 250,
  justifyContent: "center",
  alignSelf: "center",
  borderRadius: 50,
  marginBottom: 10
}
const $signIn: TextStyle = {
  justifyContent: "center",
  textAlign: "center",
  marginBottom: spacing.small,
}

const $radioButton: ViewStyle = {
  width: Width * 0.4,
  flexDirection: "row",
  alignItems: "center",
}
const $enterDetails: TextStyle = {
  marginBottom: spacing.large,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.medium,
}

const $textField: ViewStyle = {
  marginBottom: spacing.large,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.extraSmall,
  borderRadius: 50,
  backgroundColor: "#FFA717"
}
