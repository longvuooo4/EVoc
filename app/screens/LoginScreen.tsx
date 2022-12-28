import auth from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { observer } from "mobx-react-lite"
import React, { FC, useRef, useState } from "react"
import { Alert, Image, ImageStyle, SafeAreaView, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import {
  Button,
  ButtonSocial, Screen,
  Text,
  TextField
} from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import Ionicons from "react-native-vector-icons/Ionicons"
import { Input } from "@rneui/themed"
import database from "@react-native-firebase/database"


interface LoginScreenProps extends AppStackScreenProps<"Login"> { }

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen({ navigation }) {
  const [checked, setChecked] = useState(false)

  async function googleSignin() {
    try {
      await GoogleSignin.configure({
        webClientId: "442457688299-ejuki2n2rvcbelepqkjlak1719m0q4f1.apps.googleusercontent.com",
      })
      const { idToken } = await GoogleSignin.signIn()
      const googleCredential = await auth.GoogleAuthProvider.credential(idToken)
      return auth()
        .signInWithCredential(googleCredential)
        .then((userCredentials) => {
        })
        .catch((err) => {
          console.log("Login Fail !!\n" + err)
        })
    } catch (e) {
      console.error(e)
    }
  }
  const authPasswordInput = useRef<TextInput>()
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
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
          // navigation.navigate("Home")
          // Alert.alert("", `Chào mừng bạn ${auth().currentUser.displayName}`)
        })
        .catch((error) => {
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
    navigation.navigate("Signup")
  }
  return (
    <SafeAreaView
      style={$screenContentContainer}
    >
      <Image source={require('../../assets/images/EVoc.png')} style={$img} />
      <View style={$viewText} >
        <Input
          placeholder="Email"
          leftIcon={<Ionicons name="mail" size={24} color="gray" />}
          value={email}
          onChangeText={(e) => setEmail(e)}
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
      </View>
      <Button
        testID="login-button"
        tx="loginScreen.tapToSignIn"
        style={$tapButton}
        preset="reversed"
        onPress={onLoginPress}
      />
      <Text style={{ textAlign: "center", marginTop: 15 }}>or connect with</Text>
      <View style={{ alignItems: "center" }}>
        {/* <ButtonSocial text="Facebook" nameIcon="social-facebook" /> */}
        <ButtonSocial text="Google" nameIcon="social-google" onPress={googleSignin} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ textAlign: "center", marginTop: 15 }}>Don't have an account? </Text>
        <TouchableOpacity style={{ alignSelf: "center", marginTop: 15 }} onPress={onSignupPress}>
          <Text style={{ color: "#FFA717", textDecorationLine: "underline", fontWeight: "bold" }}>Create one</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: '3%',
  paddingHorizontal: spacing.large,
  backgroundColor: "#fff",
  height: "100%"
}

const $signIn: TextStyle = {
  justifyContent: "center",
  textAlign: "center",
  marginBottom: spacing.small,
}
const $img: ImageStyle = {
  height: 250,
  width: 250,
  justifyContent: "center",
  alignSelf: "center",
  borderRadius: 50
}
const $eye: ViewStyle = {
  position: 'absolute',
  right: 15,
  top: "40%"
}
const $enterDetails: TextStyle = {
  marginBottom: spacing.large,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.medium,
}

const $viewText: ViewStyle = {
  marginTop: 30,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.extraSmall,
  borderRadius: 50,
  backgroundColor: "#FFA717"
}

// @demo remove-file