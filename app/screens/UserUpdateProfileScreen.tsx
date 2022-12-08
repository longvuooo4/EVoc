import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView, StyleSheet, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackParamList } from "../navigators/AppNavigator"
import { Dialog, Header, Input, Text } from "@rneui/themed"
import { firebase } from "@react-native-firebase/database"
import database from "@react-native-firebase/database"
import RadioForm from "react-native-simple-radio-button"
import { CustomButton } from "../components/CustomButton"
import Ionicons from "react-native-vector-icons/Ionicons"
import DatePicker from "react-native-date-picker"
import moment from "moment"
import Iconicons from "react-native-vector-icons/Ionicons"

export const UserUpdateProfileScreen: FC<
  StackScreenProps<AppStackParamList, "UserUpdateProfile">
> = observer(function UserUpdateProfileScreen({ navigation, route }) {
  const user = route.params.detailsUser
  const [email, setEmail] = useState(user?.email)
  const [birthday, setBirthDay] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState(user?.phoneNumber)
  const [gender, setGender] = useState(user?.gender)
  const [date, setDate] = useState(user?.birthday)
  const options = [
    { label: "Male", value: true },
    { label: "Female", value: false },
  ]

  const updateInfoUser = (email, phone, date, gender) => {
    setLoading(true)
    database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .set({
        uid: firebase.auth().currentUser.uid,
        name: firebase.auth().currentUser.displayName,
        email: email,
        photoUrl: "https://i.pinimg.com/originals/12/61/dd/1261dda75d943cbd543cb86c15f31baa.jpg",
        phoneNumber: phone,
        birthday: date,
        gender: gender, //true is male - false is female
      })
      .then(() => {
        console.log("Update Info Successfully !!")
        setLoading(false)
        navigation.goBack()
      })
  }
  if (loading) {
    return (
      <View style={styles.container}>
        <Header
        centerComponent={<Text style={styles.titleHeader}>Update Profiel</Text>}
        backgroundColor={"#4ea9fd"}
        leftComponent={
          <Ionicons name="arrow-back" color="#000" size={28} onPress={() => navigation.goBack()} />
        }
      />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Dialog.Loading />
        </View>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <Header
        centerComponent={<Text style={styles.titleHeader}>Update Profile</Text>}
        backgroundColor={"#4ea9fd"}
        leftComponent={
          <Iconicons name="arrow-back" color="#000" size={28} onPress={() => navigation.goBack()} />
        }
      />
      <ScrollView>
        <View style={styles.content}>
          <Input
            containerStyle={styles.input}
            placeholder="Phone"
            onChangeText={(e) => setPhone(e)}
            value={phone}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            leftIcon={<Ionicons name="call" size={24} color="gray" />}
          />
          <Input
            containerStyle={styles.input}
            placeholder="Email"
            onChangeText={(e) => setEmail(e)}
            value={email}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            leftIcon={<Ionicons name="mail" size={24} color="gray" />}
          />
          <Input
            containerStyle={styles.input}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            placeholder="Birth Day DD/MM/YYYY"
            value={date}
            onChangeText={(e) => setDate(e)}
            leftIcon={
              <Ionicons name="calendar" size={24} color="gray" onPress={() => setOpen(true)} />
            }
          />
          <DatePicker
            title="Select Day"
            mode="date"
            modal
            open={open}
            date={birthday}
            onConfirm={(date) => {
              setOpen(false)
              setBirthDay(date)
              setDate(moment(date).format("DD/MM/yyyy"))
            }}
            onCancel={() => {
              setOpen(false)
            }}
          />
          <View style={styles.boxGender}>
            <RadioForm
              labelStyle={{ fontSize: 18, color: "#000", paddingRight: 30 }}
              labelHorizontal={true}
              formHorizontal={true}
              radio_props={options}
              initial={gender ? 0 : 1}
              onPress={(value) => {
                setGender(value)
              }}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.boxButton}>
        <CustomButton
          title={"Save Info User"}
          onPress={() =>
            updateInfoUser(email, phone, date, gender)
          }
        />
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    marginTop: 20,
    flex: 1,
    alignItems: "center",
  },
  input: {
    textAlign: "center",
    height: 50,
    width: 300,
    margin: 15,
    borderRadius: 16,
    backgroundColor: "#ffff",
  },
  inputBloodPressure: {
    textAlign: "center",
    height: 50,
    width: 100,
    marginVertical: 15,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: "#ffff",
  },
  boxSlider: {
    margin: 12,
    alignItems: "center",
  },
  height: {
    width: 250,
  },
  boxGender: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 30,
    width: 200,
    alignItems: "center",
    flex: 1,
  },
  boxButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  radioButton: {
    paddingLeft: 8,
  },
})
