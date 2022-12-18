import * as React from "react"
import { Image, StyleSheet, TouchableOpacity, Text, View, Dimensions, Modal, ActivityIndicator } from "react-native"
import { observer } from "mobx-react-lite"
import { launchCamera, launchImageLibrary } from "react-native-image-picker"
import { useState } from "react"
import ImageViewer from "react-native-image-zoom-viewer"

const Width = Dimensions.get("window").width
export interface ChooseImageProps {}

/**
 * Describe your component here
 */
export const ChooseImage = observer(function ChooseImage(props: ChooseImageProps) {
  const {} = props

  const [galleryPhoto, setGalleryPhoto] = useState()
  const [showImageViewer, setShowImageViewer] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  let options = {
    selectionLimit: 0,
    mediaType: "photo",
    includeBase64: false,
    includeExtra: true,
  }
  const toggleImageViewer = () => {
    setShowImageViewer(!showImageViewer);
  };
  const openGallery = async () => {
    const result = await launchImageLibrary(options)
    setGalleryPhoto(result.assets[0].uri)
  }
  const image = [{ url: galleryPhoto }]
  return (
    // <View style={styles.container}>
    // <View>
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <TouchableOpacity onPress={openGallery} style={styles.buttonContainer}>
        <Text style={styles.text}> Choose Gallery</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => toggleImageViewer()}>
        {isLoading && (
          <View >
            <ActivityIndicator size="large" />
          </View>
        )}

        <Image
          source={{ uri: galleryPhoto}}
          // style={styles.messageImage}
          onLoad={() =>  setIsLoading( false) }
        />
      </TouchableOpacity>
      <Modal onRequestClose={() => toggleImageViewer()} transparent={true} visible={showImageViewer}>
        <ImageViewer imageUrls={image} onCancel={() => toggleImageViewer()} enableSwipeDown  />
      </Modal>
    </View>
  )
})

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 8,
    marginLeft: 10,
    backgroundColor: "#4ea9fd",
    borderRadius: 15,
    borderWidth: 0,
    width: Width * 0.35,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#ffff",
    paddingVertical: 8,
  },
  imageContainer: {
    marginVertical: 24,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
})
