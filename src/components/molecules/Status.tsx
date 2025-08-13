import imagePath from "@/src/constants/imagePath";
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface StatusItem {
  id: string;
  name: string;
  time: string;
  unread?: boolean;
  isMe?: boolean;
  profileImage?: any;
  statusImage?: any;
  viewed?: boolean;
  isBusiness?: boolean;
  mute?: boolean;
  caption?: string;
  replies?: { text: string; time: string }[];
  isPrivate?: boolean;
  isVideo?: boolean;
  duration?: string;
}

const Status = () => {
  // State and ref declarations
  const [selectedStatus, setSelectedStatus] = useState<StatusItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { width } = Dimensions.get("window");

  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(0)).current;

  // Enhanced status data
  const statusData: StatusItem[] = [
    {
      id: "1",
      name: "My Status",
      time: "Tap to add update",
      profileImage: imagePath.welcome,
      isMe: true,
      statusImage: imagePath.welcome,
      caption: "Enjoying my day! 🌞",
      replies: [],
    },
    {
      id: "2",
      name: "Alice",
      time: "20 mins ago",
      profileImage: imagePath.welcome,
      unread: true,
      statusImage: imagePath.welcome,
      mute: true,
      replies: [
        { text: "Looking good!", time: "15 mins ago" },
        { text: "Where is this?", time: "10 mins ago" },
      ],
      isPrivate: true,
      isVideo: true,
      duration: "0:15",
    },
    {
      id: "3",
      name: "Bob's Business",
      time: "1 hour ago",
      profileImage: imagePath.welcome,
      unread: true,
      statusImage: imagePath.welcome,
      isBusiness: true,
      caption: "Check out our new products! 🛍️",
      replies: [{ text: "I'll visit soon!", time: "45 mins ago" }],
    },
  ];

  // Animation and status control functions
  const startProgressAnimation = () => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: width,
      duration: 15000, // 15 seconds per status
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !isPaused) handleNextStatus();
    });
  };

  const handleStatusView = (item: StatusItem) => {
    setCurrentIndex(statusData.findIndex((status) => status.id === item.id));
    setSelectedStatus(item);
    fadeAnim.setValue(0);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNextStatus = () => {
    if (currentIndex < statusData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedStatus(statusData[currentIndex + 1]);
      progressAnim.setValue(0);
    } else {
      closeStatusViewer();
    }
  };

  const closeStatusViewer = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSelectedStatus(null);
      setCurrentIndex(0);
      setIsPaused(false);
    });
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      startProgressAnimation();
    } else {
      progressAnim.stopAnimation();
    }
  };

  const handleScreenPress = (event: any) => {
    const x = event.nativeEvent.locationX;
    const screenWidth = Dimensions.get("window").width;

    if (x < screenWidth / 3) {
      handlePreviousStatus();
    } else if (x > (screenWidth / 3) * 2) {
      handleNextStatus();
    } else {
      togglePause();
    }
  };
  const handlePreviousStatus = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedStatus(statusData[currentIndex - 1]);
      progressAnim.setValue(0);
    } else {
      closeStatusViewer();
    }
  };

  const handleSendReply = () => {
    if (replyText.trim() && selectedStatus) {
      const newReply = {
        text: replyText,
        time: "Just now",
      };

      // Update the status with new reply
      const updatedStatus = {
        ...selectedStatus,
        replies: [...(selectedStatus.replies || []), newReply],
      };

      setSelectedStatus(updatedStatus);
      setReplyText("");
      setShowReplyInput(false);
    }
  };

  // Status progress bars component
  const StatusProgressBars = () => (
    <View style={styles.progressContainer}>
      {statusData.map((_, index) => (
        <View key={index} style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width:
                  index === currentIndex
                    ? progressAnim
                    : index < currentIndex
                    ? width
                    : 0,
                backgroundColor: index < currentIndex ? "#fff" : "#ffffff99",
              },
            ]}
          />
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      

      {/* Status List */}
      <View style={styles.statusListContainer}>
        {/* My Status */}
        <TouchableOpacity
          style={styles.myStatusItem}
          onPress={() => handleStatusView(statusData[0])}
        >
          <View style={styles.profileContainer}>
            <Image
              source={statusData[0].profileImage}
              style={styles.profileImage}
            />
            <View style={styles.addStatusButton}>
              <Ionicons name="add" size={16} color="#fff" />
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.myStatusTitle}>My Status</Text>
            <Text style={styles.myStatusTime}>Tap to add status update</Text>
          </View>
        </TouchableOpacity>

        {/* Recent updates */}
        <Text style={styles.sectionHeader}>Recent updates</Text>
        {statusData
          .slice(1)
          .filter((item) => !item.viewed)
          .map((item) => (
            <StatusListItem
              key={item.id}
              item={item}
              onPress={() => handleStatusView(item)}
            />
          ))}

        {/* Viewed updates */}
        <Text style={styles.sectionHeader}>Viewed updates</Text>
        {statusData
          .slice(1)
          .filter((item) => item.viewed)
          .map((item) => (
            <StatusListItem
              key={item.id}
              item={item}
              onPress={() => handleStatusView(item)}
            />
          ))}
      </View>

      {/* Camera Button */}
      <TouchableOpacity style={styles.cameraButton}>
        <View style={styles.cameraButtonInner}>
          <Ionicons name="camera" size={24} color="#008069" />
        </View>
      </TouchableOpacity>

      {/* Status View Modal */}
      <Modal
        visible={!!selectedStatus}
        transparent={false}
        animationType="none"
        onRequestClose={closeStatusViewer}
      >
        <StatusBar backgroundColor="#000" barStyle="light-content" />
        {selectedStatus && (
          <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
            <StatusProgressBars />

            <TouchableWithoutFeedback onPress={handleScreenPress}>
              <View style={styles.statusImageContainer}>
                <Image
                  source={selectedStatus.statusImage}
                  style={styles.statusImage}
                  resizeMode={selectedStatus.isVideo ? "cover" : "contain"}
                />

                {selectedStatus.isVideo && (
                  <View style={styles.videoIndicator}>
                    <Ionicons name="play" size={24} color="#fff" />
                    <Text style={styles.videoDuration}>
                      {selectedStatus.duration}
                    </Text>
                  </View>
                )}

                {selectedStatus.caption && (
                  <Text style={styles.statusCaption}>
                    {selectedStatus.caption}
                  </Text>
                )}
              </View>
            </TouchableWithoutFeedback>

            <View style={styles.statusHeader}>
              <TouchableOpacity
                style={styles.statusProfile}
                onPress={togglePause}
                activeOpacity={0.8}
              >
                <Image
                  source={selectedStatus.profileImage}
                  style={styles.statusProfileImage}
                />
                <View style={styles.statusInfo}>
                  <Text style={styles.statusName}>{selectedStatus.name}</Text>
                  <Text style={styles.statusTime}>{selectedStatus.time}</Text>
                </View>
                {selectedStatus.isPrivate && (
                  <MaterialIcons
                    name="lock"
                    size={16}
                    color="#fff"
                    style={styles.lockIcon}
                  />
                )}
                {selectedStatus.isBusiness && (
                  <MaterialIcons
                    name="verified"
                    size={16}
                    color="#008069"
                    style={styles.verifiedIcon}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.muteButton}
                onPress={() => console.log("Mute status")}
              >
                <Ionicons
                  name={selectedStatus.mute ? "volume-mute" : "volume-high"}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeStatusViewer}
            >
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={[
                styles.statusFooter,
                { bottom: keyboardHeight > 0 ? keyboardHeight + 10 : 30 },
              ]}
              keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
            >
              {showReplyInput ? (
                <View style={styles.replyInputContainer}>
                  <TextInput
                    style={styles.replyInput}
                    placeholder="Type a reply..."
                    placeholderTextColor="#aaa"
                    value={replyText}
                    onChangeText={setReplyText}
                    autoFocus={true}
                    multiline
                  />
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendReply}
                    disabled={!replyText.trim()}
                  >
                    <Ionicons
                      name="send"
                      size={24}
                      color={replyText.trim() ? "#008069" : "#aaa"}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() => setShowReplyInput(true)}
                  >
                    <FontAwesome name="reply" size={24} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.footerButton}>
                    <Ionicons name="camera" size={24} color="#fff" />
                  </TouchableOpacity>

                  {selectedStatus.replies &&
                    selectedStatus.replies.length > 0 && (
                      <View style={styles.replyCountBadge}>
                        <Text style={styles.replyCountText}>
                          {selectedStatus.replies.length}
                        </Text>
                        <FontAwesome
                          name="reply"
                          size={14}
                          color="#fff"
                          style={styles.replyIcon}
                        />
                      </View>
                    )}
                </>
              )}
            </KeyboardAvoidingView>

            {/* Replies preview */}
            {selectedStatus.replies &&
              selectedStatus.replies.length > 0 &&
              !showReplyInput && (
                <Animated.View
                  style={[
                    styles.repliesPreview,
                    {
                      transform: [
                        {
                          translateY: slideUpAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [100, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.repliesTitle}>Replies</Text>
                  {selectedStatus.replies.slice(0, 2).map((reply, index) => (
                    <View key={index} style={styles.replyItem}>
                      <Text style={styles.replyText}>{reply.text}</Text>
                      <Text style={styles.replyTime}>{reply.time}</Text>
                    </View>
                  ))}
                  {selectedStatus.replies.length > 2 && (
                    <Text style={styles.viewAllReplies}>
                      +{selectedStatus.replies.length - 2} more replies
                    </Text>
                  )}
                </Animated.View>
              )}
          </Animated.View>
        )}
      </Modal>
    </View>
  );
};

// Status List Item Component (extracted for better organization)
const StatusListItem = ({
  item,
  onPress,
}: {
  item: StatusItem;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={styles.statusItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.profileContainer}>
      <Image source={item.profileImage} style={styles.profileImage} />
      {item.unread && !item.viewed && <View style={styles.unreadRing} />}
    </View>

    <View style={styles.textContainer}>
      <View style={styles.nameRow}>
        <Text style={[styles.name, item.unread && styles.unreadName]}>
          {item.name}
        </Text>
        {item.isBusiness && (
          <MaterialIcons
            name="verified"
            size={16}
            color="#008069"
            style={styles.verifiedIcon}
          />
        )}
      </View>
      <View style={styles.timeRow}>
        <Text style={[styles.time, item.unread && styles.unreadTime]}>
          {item.time}
        </Text>
        {item.mute && (
          <Ionicons
            name="volume-mute"
            size={14}
            color="#999"
            style={styles.muteIcon}
          />
        )}
      </View>
    </View>

    {item.unread && !item.viewed ? (
      <View style={styles.unreadBadge} />
    ) : (
      <Ionicons name="checkmark-done" size={18} color="#999" />
    )}
  </TouchableOpacity>
);

// Styles (organized for better maintainability)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    backgroundColor: "#008069",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 50 : 16,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
  },
  statusPrivacyButton: {
    padding: 5,
    marginRight: 10,
  },
  menuButton: {
    padding: 5,
  },
  statusListContainer: {
    flex: 1,
  },
  myStatusItem: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 8,
    borderBottomColor: "#f5f5f5",
  },
  myStatusTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  myStatusTime: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  sectionHeader: {
    padding: 12,
    paddingLeft: 16,
    backgroundColor: "#f5f5f5",
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  statusItem: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e5e5",
  },
  profileContainer: {
    position: "relative",
    marginRight: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#008069",
  },
  unreadRing: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#25D366",
    top: -3,
    left: -3,
  },
  addStatusButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#25D366",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  unreadName: {
    fontWeight: "700",
  },
  time: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  unreadTime: {
    color: "#25D366",
    fontWeight: "bold",
  },
  unreadBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#25D366",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#fff",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cameraButtonInner: {
    backgroundColor: "#25D366",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  progressContainer: {
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  progressBarBackground: {
    flex: 1,
    height: 3,
    backgroundColor: "#ffffff40",
    marginHorizontal: 2,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
  },
  statusImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusImage: {
    width: "100%",
    height: "100%",
  },
  videoIndicator: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  videoDuration: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 14,
  },
  statusCaption: {
    position: "absolute",
    bottom: 100,
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  statusHeader: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  statusProfile: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#25D366",
  },
  statusInfo: {
    flex: 1,
  },
  statusName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statusTime: {
    color: "#fff",
    fontSize: 14,
  },
  lockIcon: {
    marginLeft: 8,
  },
  verifiedIcon: {
    marginLeft: 5,
  },
  muteButton: {
    padding: 8,
    marginLeft: 10,
  },
  closeButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    padding: 5,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  muteIcon: {
    marginLeft: 5,
  },
  statusFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  footerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  replyInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    maxHeight: 100,
  },
  replyInput: {
    flex: 1,
    color: "#fff",
    maxHeight: 80,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  replyCountBadge: {
    position: "absolute",
    right: 20,
    bottom: 60,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  replyCountText: {
    color: "#fff",
    marginRight: 5,
    fontWeight: "bold",
    fontSize: 14,
  },
  replyIcon: {
    marginLeft: 2,
  },
  repliesPreview: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 100,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderTopWidth: 1,
    borderTopColor: "#333",
    padding: 15,
  },
  repliesTitle: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  replyItem: {
    marginBottom: 10,
  },
  replyText: {
    color: "#fff",
    fontSize: 14,
  },
  replyTime: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
  },
  viewAllReplies: {
    color: "#25D366",
    fontSize: 14,
    marginTop: 5,
  },
});

export default Status;
