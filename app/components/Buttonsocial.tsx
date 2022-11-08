import * as React from "react"
import { StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native"
import { observer } from "mobx-react-lite"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import { Icon } from "@rneui/themed"

export interface ButtonSocialProps {
  /**
   * An optional style override useful for padding & margin.
   */
  text: string
  nameIcon: string
  onPress?: () => void
}
const { width } = Dimensions.get("window")

/**
 * Describe your component here
 */
export const ButtonSocial = observer(function ButtonSocial(props: ButtonSocialProps) {
  const { text, nameIcon, onPress } = props

  return (
    <TouchableOpacity style={[styles.btn]} onPress={onPress}>
      <SimpleLineIcons name={nameIcon} style={[styles.icon]} />
      <Text style={[styles.text]}>Login with {text}</Text>
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 5,
    width: width * 0.7,
    borderWidth: 1,
    borderColor: "#FFA717",
    borderRadius: 20,
    backgroundColor: "#ffffff",
  },
  text: {
    fontSize: 16,
    color: "#747070",
    paddingVertical: 10,
  },
  icon: {
    color: "#FFA717",
    fontSize: 30,
    marginLeft: 5,
    marginRight: 30,
  },
})