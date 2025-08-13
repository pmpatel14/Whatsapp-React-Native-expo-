import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

// Screens
import Calls from "@/src/components/molecules/Calls";
import Chats from "@/src/components/molecules/Chats";
import Status from "@/src/components/molecules/Status";

const TABS = [
  { id: "chat", label: "Chats" },
  { id: "status", label: "Status" },
  { id: "calls", label: "Calls" },
];

const Main = () => {
  const [currentPage, setCurrentPage] = useState("chat");
  const underlineAnim = useRef(new Animated.Value(0)).current;

  // Animate underline when tab changes
  useEffect(() => {
    const index = TABS.findIndex((tab) => tab.id === currentPage);
    Animated.spring(underlineAnim, {
      toValue: index,
      useNativeDriver: false,
      bounciness: 8,
    }).start();
  }, [currentPage]);

  // Function to get active screen
  const renderActivePage = () => {
    switch (currentPage) {
      case "chat":
        return <Chats />;
      case "status":
        return <Status />;
      case "calls":
        return <Calls />;
      default:
        return <Chats />;
    }
  };

  // Function to render each tab
  const renderTab = (tab) => {
    const isActive = currentPage === tab.id;
    return (
      <TouchableOpacity
        key={tab.id}
        activeOpacity={0.7}
        onPress={() => setCurrentPage(tab.id)}
        style={styles.tabButton}
      >
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  // Underline width & position animation
  const underlineWidth = 100 / TABS.length;
  const translateX = underlineAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [
      `${0 * underlineWidth}%`,
      `${1 * underlineWidth}%`,
      `${2 * underlineWidth}%`,
    ],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#008069" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>WhatsApp</Text>
        <View style={styles.headerIcons}>
          <Ionicons
            name="camera-outline"
            size={22}
            color="#fff"
            style={styles.icon}
          />
          <Ionicons name="search" size={22} color="#fff" style={styles.icon} />
          <MaterialIcons name="more-vert" size={22} color="#fff" />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map(renderTab)}
        <Animated.View
          style={[
            styles.underline,
            {
              width: `${underlineWidth}%`,
              transform: [
                {
                  translateX: underlineAnim.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [0, scale(117), scale(234)],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      {/* Page Content */}
      {renderActivePage()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#008069",
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(10),
  },
  headerTitle: {
    color: "#fff",
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  icon: { marginHorizontal: scale(8) },

  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#008069",
    position: "relative",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: verticalScale(10),
  },
  tabText: {
    color: "#b2dfdb",
    fontSize: moderateScale(15),
    fontWeight: "bold",
  },
  activeTabText: { color: "#fff" },
  underline: {
    height: moderateScale(3),
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    paddingHorizontal: scale(10),
    borderRadius: moderateScale(1.5),
    left: 0,
    right: 0,
  },
});

export default Main;
