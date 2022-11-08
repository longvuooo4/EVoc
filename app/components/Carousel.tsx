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

      return (
        <FlipCard 
          style={styles.tag}
          friction={6}
          perspective={1000}
          flipHorizontal={true}
          flipVertical={true}
          flip={false}
          clickable={true}
          // onFlipEnd={(isFlipEnd) => {
          //   console.log("isFlipEnd", isFlipEnd)
          // }}
        >
          <View style={styles.card}>
            <TouchableOpacity onPress={changeHeart}>
              <Octicons
                style={[styles.heartIcon, isHeart ? styles.redHeart : styles.heartIcon]}
                name="heart-fill"
              />
            </TouchableOpacity>
            <Text style={styles.voc}>{item.en}</Text>
          </View>

          <View style={styles.card}>
            <TouchableOpacity onPress={changeHeart}>
              <Octicons
                style={[styles.heartIcon, isHeart ? styles.redHeart : styles.heartIcon]}
                name="heart-fill"
              />
            </TouchableOpacity>
            <Text style={styles.voc}>{item.vn}</Text>
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
            // keyExtractor={(item) => item.}
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
  redHeart: { color: "red" },
  voc: {
    fontSize: 48,
    color: "#000000",
    // marginLeft: 20,
    // marginTop: 20,
    // marginRight: 60,
    lineHeight: Height * 0.4,
    textAlign: "center",
  },
  // viewVoc:{
  //   width: Width,
  //   height: Height,
  //   justifyContent: "center",
  //   backgroundColor: "red",

  // },
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
