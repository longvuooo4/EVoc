import { Text, StyleSheet, TouchableOpacity } from "react-native"
import React from "react"
import { observer } from "mobx-react-lite"

export interface CustomButton {
  title?: any
  onPress?: any
}

export const CustomButton = React.memo(
  observer(function MyHeader(props: CustomButton) {
    return (
      <TouchableOpacity style={styles.button} onPress={props.onPress}>
        {/* <CustomText title={props.title} size={moderateScale(18)}></CustomText> */}
        <Text style={styles.titleButton}>{props.title}</Text>
      </TouchableOpacity>
    )
  }),
)
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4ea9fd",
    width: 250,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
    justifyContent: "center",
  },
  titleButton: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
})
