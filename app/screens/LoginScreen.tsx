import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { Alert, TextInput, TextStyle, View, ViewStyle, TouchableOpacity } from "react-native"
import {
  Button,
  ButtonSocial,
  Icon,
  Screen,
  Text,
  TextField,
  TextFieldAccessoryProps,
} from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import auth from "@react-native-firebase/auth"
import { useNavigation } from "@react-navigation/native"
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin"
interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen({ navigation }) {
  async function googleSignin() {
    try {
      await GoogleSignin.configure({
        webClientId: "442457688299-ejuki2n2rvcbelepqkjlak1719m0q4f1.apps.googleusercontent.com",
      })
      const { idToken } = await GoogleSignin.signIn()
      // console.log(GoogleSignin.signIn())

      const googleCredential = await auth.GoogleAuthProvider.credential(idToken)
      return auth()
        .signInWithCredential(googleCredential)
        .then((userCredentials) => {
          console.log(googleCredential)

          // navigation.navigate("Home")
          // navigation.reset({
          //   index: 0,
          //   // routes: [{ name: "user" }],
          // })
        })
        .catch((err) => {
          console.log("Login Fail !!\n" + err)
        })
    } catch (e) {
      console.error(e)
    }
  }
  const authPasswordInput = useRef<TextInput>()
  // const navigation = useNavigation()
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  // const [isSubmitted, setIsSubmitted] = useState(false)
  // const [attemptsCount, setAttemptsCount] = useState(0)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const {
    authenticationStore: { setAuthToken },
  } = useStores()
  const onLoginPress = () => {
    if (email == "" || password == "") {
      Alert.alert("Login failed", "Please enter email and password")
    } else {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          Alert.alert("Đăng nhập thành công", `Chào mừng bạn ${email}`)
        })
        .catch((error) => {
          // console.log(error.code)

          if (error.code === "auth/invalid-email") {
            Alert.alert("Lỗi đăng nhập", "Email không đúng cú pháp")
          }
          if (error.code === "auth/user-not-found") {
            Alert.alert("Lỗi đăng nhập", "Email không tồn tại")
          }

          if (error.code === "auth/wrong-password") {
            Alert.alert("Lỗi đăng nhập", "Mật khẩu không đúng")
          }
          if (error.code === "auth/too-many-requests") {
            Alert.alert(
              "Lỗi đăng nhập",
              "Bạn đã đăng nhập sai quá nhiều lần, tài khoản tạm thời bị khoá",
            )
          }

          console.error(error)
        })
    }
  }
  const onSignupPress = () => {
    // navigation.navigate("Signup")
  }
  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="login-heading" text="Sign In" preset="heading" style={$signIn} />
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
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
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
        onSubmitEditing={onLoginPress}
        // RightAccessory={PasswordRightAccessory}
      />

      <Button
        testID="login-button"
        tx="loginScreen.tapToSignIn"
        style={$tapButton}
        preset="reversed"
        onPress={onLoginPress}
      />
      <Text style={{ textAlign: "center", marginTop: 15 }}>or connect with</Text>
      <View style={{ alignItems: "center" }}>
        <ButtonSocial text="Facebook" nameIcon="social-facebook" />
        <ButtonSocial text="Google" nameIcon="social-google" onPress={googleSignin} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ textAlign: "center", marginTop: 15 }}>Don't have an account? </Text>
        <TouchableOpacity style={{ alignSelf: "center", marginTop: 15 }} onPress={onSignupPress}>
          <Text style={{ color: "#FFA717", textDecorationLine: "underline" }}>Create one</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
}

const $signIn: TextStyle = {
  justifyContent: "center",
  textAlign: "center",
  marginBottom: spacing.small,
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

// @demo remove-file