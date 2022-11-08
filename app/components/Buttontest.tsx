import * as React from "react"
import { Dimensions, StyleProp, TextStyle, View, ViewStyle, TouchableOpacity } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "../theme"
import { Text } from "./Text"


const Width = Dimensions.get("window").width
const Height = Dimensions.get("window").height
export interface ButtontestProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  text: string
}

/**
 * Describe your component here
 */
export const Buttontest = observer(function Buttontest(props: ButtontestProps) {
  const { style, text } = props
  const $styles = [$container, style]

  return (
    <TouchableOpacity style={$styles}>
      <Text style={$text}>{text}</Text>
    </TouchableOpacity>
  )
})

const $container: ViewStyle = {
  // marginHorizontal: 10,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  width: Width * 0.3,
  height: Height * 0.05,
  borderRadius: 15
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 16,
  fontWeight: "bold",
  color: colors.palette.primary500,
}
