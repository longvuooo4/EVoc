import React, { FC, useEffect, useLayoutEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, Dimensions, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Button, ButtonSocial, Header, Screen, Text, TextField } from "../components"
import { colors, spacing } from "../theme"
import auth, { firebase } from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"
import { RadioButton } from "react-native-paper"

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
        Alert.alert("Can't be empty")
      } else if (password != passwordRepeat) {
        Alert.alert("Incorrect re-password")
        setPassword("")
        setPasswordRepeat("")
      } else if (password === passwordRepeat) {
        try {
          await auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {})
            .then(() => {
              console.log("Register with:" + email)
            })
            .catch((e) => {
              if (e.code === "auth/email-already-in-use") {
                Alert.alert("That email address is already in use!")
              }

              if (e.code === "auth/invalid-email") {
                Alert.alert("That email address is invalid!")
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
                  Alert.alert("Register successful", `Chúc mừng bạn ${name} đã đăng ký thành công`)

                  resetForm()
                })
            })
        } catch (e) {}
      }
      // navigation.navigate('confirmemail')
    }

    return (
      <Screen
        preset="auto"
        contentContainerStyle={$screenContentContainer}
        safeAreaEdges={["top", "bottom"]}
      >
        <Text testID="login-heading" text="Sign Up" preset="heading" style={$signIn} />
        {/* <Text tx="loginScreen.enterDetails" preset="subheading" style={$enterDetails} /> */}
        {/* {attemptsCount > 2 && <Text tx="loginScreen.hint" size="sm" weight="light" style={$hint} />} */}

        <TextField
          value={email}
          onChangeText={setEmail}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="loginScreen.emailFieldLabel"
          placeholderTx="loginScreen.emailFieldPlaceholder"
        />
        <TextField
          value={name}
          onChangeText={setName}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="name"
          autoCorrect={false}
          keyboardType="default"
          labelTx="loginScreen.nameFieldLabel"
          placeholderTx="loginScreen.nameFieldPlaceholder"
          // onSubmitEditing={() => authPasswordInput.current?.focus()}
        />
        <TextField
          // ref={authPasswordInput}
          value={password}
          onChangeText={setPassword}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={isAuthPasswordHidden}
          labelTx="loginScreen.passwordFieldLabel"
          placeholderTx="loginScreen.passwordFieldPlaceholder"
          // helper={errors?.authPassword}
          // status={errors?.authPassword ? "error" : undefined}
          // onSubmitEditing={onLoginPress}
          // RightAccessory={PasswordRightAccessory}
        />
        <TextField
          // ref={authPasswordInput}
          value={passwordRepeat}
          onChangeText={setPasswordRepeat}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={isAuthPasswordHidden}
          label="Confirm Password"
          placeholder="Confirm password"
          // helper={errors?.authPassword}
          // status={errors?.authPassword ? "error" : undefined}
          // onSubmitEditing={onLoginPress}
          // RightAccessory={PasswordRightAccessory}
        />

        <Text style={{fontWeight: "700", fontSize: 16}}>You are?</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
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
}
