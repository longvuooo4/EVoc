import { observer } from "mobx-react-lite"
import React, {
  FC,
  useEffect,
  useLayoutEffect,
  useState, // @demo remove-current-line
} from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  Button, // @demo remove-current-line
  Header, // @demo remove-current-line
  Text,
} from "../components"
import { isRTL } from "../i18n"
import { useStores } from "../models" // @demo remove-current-line
import { AppStackScreenProps } from "../navigators" // @demo remove-current-line
import { colors, spacing } from "../theme"
import auth from "@react-native-firebase/auth"
import Dialog from "react-native-dialog";
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import database from "@react-native-firebase/database"

const welcomeLogo = require("../../assets/images/EVoc.png")
const welcomeFace = require("../../assets/images/welcome-face.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> { } // @demo remove-current-line

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(
  _props, // @demo remove-current-line
) {
  // @demo remove-block-start
  const { navigation } = _props
  const [checked, setChecked] = useState(false)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    database()
      .ref("users/")
      .on("value", (snapshot) => {
        Object.keys(snapshot.val()).map((key) => {
          if (key == auth().currentUser.uid) {
            setVisible(false)
          }else setVisible(true)
        })
      })
    return () => {
    }
  }, [])

  const {
    authenticationStore: { logout },
  } = useStores()
  function onLogoutPress() {
    auth()
      .signOut()
      .then(() => console.log("User signed out!"))
  }
  function goNext() {
    navigation.navigate("Home")
  }
  const handleSave = () => {

    database().ref("/users/" + auth().currentUser.uid).update({
      email: auth().currentUser.email,
      uid: auth().currentUser.uid,
      checked: checked,
      name: auth().currentUser.displayName,
      photoUrl: auth().currentUser.photoURL
    }).then(() => {
    })
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => <Header rightTx="common.logOut" onRightPress={onLogoutPress} />,
    })
  }, [])
  // @demo remove-block-end

  return (
    <View style={$container}>
      <View style={$topContainer}>
        <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
        <Text
          testID="welcome-heading"
          style={$welcomeHeading}
          text="Welcome to the E - Voc App"
          preset="bold"
        />
        <Text tx="welcomeScreen.exciting" preset="subheading" />
        <Image style={$welcomeFace} source={welcomeFace} resizeMode="contain" />
      </View>

      <SafeAreaView style={$bottomContainer} edges={["bottom"]}>
        <View style={$bottomContentContainer}>
          <Text tx="welcomeScreen.postscript" size="md" />
          {/* @demo remove-block-start */}
          <Button
            testID="next-screen-button"
            preset="reversed"
            tx="welcomeScreen.letsGo"
            onPress={goNext}
          />
          {/* @demo remove-block-end */}
        </View>
      </SafeAreaView>
      <View style={{
        flex:0,
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Dialog.Container visible={visible}>
          <Dialog.Title>Role</Dialog.Title>
          <Dialog.Switch value={checked} onChange={() => setChecked(!checked)} label={"If you are a teacher, turn the switch, otherwise you will be a student"}></Dialog.Switch>
          <Dialog.Button label="Cancel" onPress={() => {
            setVisible(false)
          }} />
          <Dialog.Button label="Save" onPress={handleSave} />
        </Dialog.Container>
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0.7,
  flexBasis: "57%",
  justifyContent: "center",
  paddingHorizontal: spacing.large,
}

const $bottomContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "43%",
  backgroundColor: colors.palette.neutral100,
  borderRadius: 16
}

const $bottomContentContainer: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.large,
  justifyContent: "space-around",
}

const $welcomeLogo: ImageStyle = {
  height: 250,
  width: 250,
  alignSelf: "center",
  borderRadius: 50,
  marginBottom: spacing.extraSmall,
}

const $welcomeFace: ImageStyle = {
  height: 169,
  width: 269,
  position: "absolute",
  bottom: -47,
  right: -80,
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $welcomeHeading: TextStyle = {
  marginBottom: spacing.medium,
  fontSize: 25,
  marginTop: 15
}