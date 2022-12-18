import * as React from "react"
import {
  Animated,
  Dimensions,
  FlatList,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleSheet,
} from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "../theme"
import { Text } from "./Text"
import { memo, useRef, useState } from "react"
import Octicons from "react-native-vector-icons/Octicons"
import FlipCard from "react-native-flip-card"
import Tts from "react-native-tts"

export interface CarouselProps {
  /**
   * An optional style override useful for padding & margin.
   */
  data?
}

/**
 * Describe your component here
 */
export const Carousel = memo(
  observer(function Carousel(props: CarouselProps) {
    const { data } = props
    const [currentIndex, setCurrentIndex] = useState(0)

    const scrollX = useRef(new Animated.Value(0)).current
    const slideRef = useRef(null)
    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
      setCurrentIndex(viewableItems[0].index)
    }).current
    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current
    const CarouselItem = ({ item }) => {
      const [isHeart, setIsHeart] = useState(false)

      const changeHeart = () => {
        setIsHeart(!isHeart)
      }
      Tts.setDefaultLanguage("en-US")
      return (
        <FlipCard
          style={styles.tag}
          friction={6}
          perspective={1000}
          flipHorizontal={true}
          flipVertical={true}
          flip={false}
          clickable={true}
        >
          <View style={styles.card}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Tts.speak(item.en)
                }}
              >
                <Octicons style={[styles.speaker]} name="unmute" />
              </TouchableOpacity>
            </View>
            <View style={{height: Height*0.3, marginBottom: 70, alignSelf: "center", justifyContent: "center"}}>
              <Text style={[styles.voc,{paddingTop: 50, lineHeight: 50}]} ellipsizeMode="tail">{item.en} ( {item.type} )</Text>
            </View>
            <View
              style={{
                backgroundColor: "#d9f7cf",
                height: 120,
                width: Width * 0.95,
                position: "absolute",
                bottom: -35,
                right: 0,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Tts.speak(item.more)
                }}
              >
                <Octicons
                  style={[
                    styles.speaker,
                    { position: "absolute", bottom: -33, left: 15, fontSize: 25, color: "black" },
                  ]}
                  name="unmute"
                />
              </TouchableOpacity>
              <Text style={styles.more} numberOfLines={2} maxFontSizeMultiplier={2}>
                Ex: {item.more}
              </Text>
            </View>
          </View>

          <View style={[styles.card, {height: Height*0.5, marginBottom: 70, alignSelf: "center", justifyContent: "center"}]}>
            <Text style={[styles.voc, { marginTop: 30, lineHeight: 50 }]} numberOfLines={5}>
              {item.vn}
            </Text>
          </View>
        </FlipCard>
      )
    }
    const Paginator = ({ data, scrollX }: any) => {
      return (
        <View
          style={{
            flexDirection: "row",
            height: 32,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 15,
          }}
        >
          {data.map((_item: any, index: number) => {
            const inputRange = [(index - 1) * Width, index * Width, (index + 1) * Width]
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 20, 10],
              extrapolate: "clamp",
            })
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            })
            return (
              <Animated.View
                style={[styles.dot, { width: dotWidth, opacity }]}
                key={index.toString()}
              />
            )
          })}
        </View>
      )
    }
    if (data && data.length) {
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            data={data}
            renderItem={({ item }) => <CarouselItem item={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
              useNativeDriver: false,
            })}
            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            ref={slideRef}
          />

          <Paginator data={data} scrollX={scrollX} />
        </View>
      )
    }
    return null
  }),
)
const $container: ViewStyle = {
  justifyContent: "center",
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}
const Width = Dimensions.get("window").width
const Height = Dimensions.get("window").height
const styles = StyleSheet.create({
  tag: {
    width: Width * 0.95,
    height: Height * 0.6,
    backgroundColor: "#C76542",
    marginHorizontal: (Width - Width * 0.95) / 2,
    borderRadius: 20,
    marginTop: 15,
  },
  card: {
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
  },
  heartIcon: {
    fontSize: 42,
    alignSelf: "flex-end",
    margin: 8,
    color: "#ffff",
  },
  speaker: {
    fontSize: 42,
    alignSelf: "flex-end",
    margin: 8,
    color: "#ffff",
  },
  voc: {
    fontSize: 42,
    color: "#000000",
    width: Width * 0.8,
    textAlign: "center"
  },
  more: {
    marginHorizontal: 20,
    marginTop: 30,
    fontSize: 20,
    justifyContent: "center",
  },
  refresh: {
    // backgroundColor: 'white',
    // justifyContent: 'center',
    alignItems: "flex-end",
    flex: 0.75,
    borderRadius: 50,
  },
  touchrefr: {},
  refricon: {
    alignSelf: "center",
    fontSize: 45,
    padding: 5,
    marginRight: 40,
    backgroundColor: "#987",
    borderRadius: 50,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#C76542",
    marginHorizontal: 8,
  },
})
