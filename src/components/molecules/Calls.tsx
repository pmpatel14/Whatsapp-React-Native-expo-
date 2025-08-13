import imagePath from "@/src/constants/imagePath";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface CallItem {
  id: string;
  name: string;
  phone: string;
  time: string;
  type: "incoming" | "outgoing" | "missed";
  duration?: string;
  avatar: any;
  video?: boolean;
  callLog?: string[];
  isBusiness?: boolean;
  isVerified?: boolean;
  isMuted?: boolean;
  isFavorite?: boolean;
}

const Calls = () => {
  const navigation = useNavigation();
  const [calls, setCalls] = useState<CallItem[]>([
    {
      id: "1",
      name: "John Doe",
      phone: "+1 234 567 890",
      time: "Today, 10:30 AM",
      type: "missed",
      duration: "5:32",
      avatar: imagePath.welcome,
      video: false,
      callLog: ["Today 10:30 AM (Missed)", "Yesterday 2:00 PM (5:32)"],
      isFavorite: true,
    },
    {
      id: "2",
      name: "Alice Smith (Business)",
      phone: "+1 345 678 901",
      time: "Yesterday, 2:45 PM",
      type: "incoming",
      duration: "12:15",
      avatar: imagePath.welcome,
      video: true,
      callLog: ["Yesterday 2:45 PM (12:15)", "Monday 9:00 AM (3:21)"],
      isBusiness: true,
      isVerified: true,
    },
    {
      id: "3",
      name: "Bob Johnson",
      phone: "+1 456 789 012",
      time: "Yesterday, 11:15 AM",
      type: "outgoing",
      duration: "2:45",
      avatar: imagePath.welcome,
      video: false,
      callLog: ["Yesterday 11:15 AM (2:45)"],
      isMuted: true,
    },
    {
      id: "4",
      name: "Emma Wilson",
      phone: "+1 567 890 123",
      time: "Monday, 9:30 AM",
      type: "missed",
      avatar: imagePath.welcome,
      video: true,
      callLog: ["Monday 9:30 AM (Missed)", "Sunday 7:00 PM (8:12)"],
    },
    {
      id: "5",
      name: "Michael Brown",
      phone: "+91 7043 3353 83",
      time: "Sunday, 7:20 PM",
      type: "incoming",
      duration: "1:23",
      avatar: imagePath.welcome,
      video: false,
      callLog: ["Sunday 7:20 PM (1:23)"],
      isFavorite: true,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCall, setSelectedCall] = useState<CallItem | null>(null);
  const [showCreateCallModal, setShowCreateCallModal] = useState(false);
  const [showCallLog, setShowCallLog] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "missed">("all");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  const filteredCalls = calls.filter(
    (call) =>
      (call.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        call.phone.includes(searchQuery)) &&
      (activeTab === "all" || call.type === "missed")
  );

  const handleCallPress = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleVideoCallPress = (phone: string) => {
    // Implement video call functionality
    console.log("Video calling:", phone);
    // For demo purposes, we'll just show an alert
    alert(`Initiating video call to ${phone}`);
  };

  const toggleCallLog = (call: CallItem) => {
    setSelectedCall(call);
    if (showCallLog && selectedCall?.id === call.id) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowCallLog(false));
    } else {
      setShowCallLog(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const toggleFavorite = (id: string) => {
    setCalls(
      calls.map((call) =>
        call.id === id ? { ...call, isFavorite: !call.isFavorite } : call
      )
    );
  };

  const toggleMute = (id: string) => {
    setCalls(
      calls.map((call) =>
        call.id === id ? { ...call, isMuted: !call.isMuted } : call
      )
    );
  };

  const renderCallItem = ({ item }: { item: CallItem }) => (
    <TouchableOpacity
      style={styles.callItem}
      onPress={() => setSelectedCall(item)}
      onLongPress={() => toggleCallLog(item)}
    >
      <View style={styles.avatarContainer}>
        <Image source={item.avatar} style={styles.avatar} />
        {item.isFavorite && (
          <View style={styles.favoriteBadge}>
            <Ionicons name="star" size={12} color="#fff" />
          </View>
        )}
      </View>

      <View style={styles.callInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          {item.isBusiness && (
            <MaterialIcons
              name={item.isVerified ? "verified" : "business"}
              size={16}
              color={item.isVerified ? "#008069" : "#666"}
              style={styles.businessIcon}
            />
          )}
        </View>

        <View style={styles.callDetails}>
          <Ionicons
            name={item.type === "incoming" ? "arrow-down" : "arrow-up"}
            size={14}
            color={item.type === "missed" ? "#ff3b30" : "#34c759"}
            style={styles.callIcon}
          />
          {item.video && (
            <Ionicons
              name="videocam"
              size={14}
              color="#666"
              style={styles.callIcon}
            />
          )}
          <Text
            style={[styles.time, item.type === "missed" && styles.missedCall]}
          >
            {item.time}
          </Text>
        </View>

        {showCallLog && item.id === selectedCall?.id && (
          <Animated.View
            style={[styles.callLogContainer, { opacity: fadeAnim }]}
          >
            {item.callLog?.map((log, index) => (
              <View key={index} style={styles.callLogItem}>
                <Ionicons name="time" size={12} color="#666" />
                <Text style={styles.callLogText}>{log}</Text>
              </View>
            ))}
          </Animated.View>
        )}
      </View>

      <View style={styles.callActions}>
        {item.duration && <Text style={styles.duration}>{item.duration}</Text>}
        <TouchableOpacity
          style={styles.callButton}
          onPress={() =>
            item.video
              ? handleVideoCallPress(item.phone)
              : handleCallPress(item.phone)
          }
        >
          <Ionicons
            name={item.video ? "videocam" : "call"}
            size={24}
            color={item.type === "missed" ? "#ff3b30" : "#34c759"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const openFilterModal = () => {
    setShowFilterModal(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeFilterModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowFilterModal(false));
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#008069" barStyle="light-content" />

      {/* Header with tabs */}
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "all" && styles.activeTab]}
            onPress={() => setActiveTab("all")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "all" && styles.activeTabText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "missed" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("missed")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "missed" && styles.activeTabText,
              ]}
            >
              Missed
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={openFilterModal}>
          <Ionicons name="filter" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={18}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search name or number"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close" size={18} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Call list */}
      <FlatList
        data={filteredCalls}
        renderItem={renderCallItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.createCallLink}
            onPress={() => setShowCreateCallModal(true)}
          >
            <View style={styles.createCallIcon}>
              <Ionicons name="link" size={20} color="#008069" />
            </View>
            <Text style={styles.createCallText}>Create call link</Text>
            <Text style={styles.createCallSubtext}>
              Share a link for your WhatsApp call
            </Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="call" size={48} color="#ccc" />
            <Text style={styles.emptyText}>
              No {activeTab === "missed" ? "missed" : ""} calls found
            </Text>
          </View>
        }
      />

      {/* Floating action buttons */}
      <View style={styles.floatingButtons}>
        <TouchableOpacity
          style={[styles.floatingButton, styles.videoCallButton]}
          onPress={() => setShowCreateCallModal(true)}
        >
          <Ionicons name="videocam" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.floatingButton, styles.voiceCallButton]}
          onPress={() => setShowCreateCallModal(true)}
        >
          <Ionicons name="call" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="none"
        onRequestClose={closeFilterModal}
      >
        <TouchableWithoutFeedback onPress={closeFilterModal}>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.filterModalContainer,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <Text style={styles.filterTitle}>Filter calls</Text>

              <TouchableOpacity
                style={styles.filterOption}
                onPress={() => {
                  setActiveTab("all");
                  closeFilterModal();
                }}
              >
                <Text style={styles.filterOptionText}>All calls</Text>
                {activeTab === "all" && (
                  <Ionicons name="checkmark" size={20} color="#008069" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.filterOption}
                onPress={() => {
                  setActiveTab("missed");
                  closeFilterModal();
                }}
              >
                <Text style={styles.filterOptionText}>Missed calls</Text>
                {activeTab === "missed" && (
                  <Ionicons name="checkmark" size={20} color="#008069" />
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Create Call Modal */}
      <Modal
        visible={showCreateCallModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCreateCallModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Start a call</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setShowCreateCallModal(false);
                navigation.navigate("Contacts");
              }}
            >
              <View style={styles.modalOptionIcon}>
                <Ionicons name="call" size={24} color="#008069" />
              </View>
              <View>
                <Text style={styles.modalOptionText}>New voice call</Text>
                <Text style={styles.modalOptionSubtext}>
                  Select a contact to call
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setShowCreateCallModal(false);
                navigation.navigate("Contacts");
              }}
            >
              <View style={styles.modalOptionIcon}>
                <Ionicons name="videocam" size={24} color="#008069" />
              </View>
              <View>
                <Text style={styles.modalOptionText}>New video call</Text>
                <Text style={styles.modalOptionSubtext}>
                  Select a contact for video call
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.modalDivider} />

            <TouchableOpacity style={styles.modalOption}>
              <View style={styles.modalOptionIcon}>
                <Ionicons name="link" size={24} color="#008069" />
              </View>
              <View>
                <Text style={styles.modalOptionText}>Create call link</Text>
                <Text style={styles.modalOptionSubtext}>
                  Share a link for your call
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCreateCallModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Call Details Modal */}
      {selectedCall && (
        <Modal
          visible={!!selectedCall}
          transparent={false}
          animationType="slide"
          onRequestClose={() => setSelectedCall(null)}
        >
          <View style={styles.detailsContainer}>
            <View style={styles.detailsHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setSelectedCall(null)}
              >
                <Ionicons name="arrow-back" size={24} color="#008069" />
              </TouchableOpacity>
              <Text style={styles.detailsTitle}>Call Details</Text>
              <View style={{ width: 24 }} /> {/* For alignment */}
            </View>

            <ScrollView contentContainerStyle={styles.detailsContent}>
              <Image
                source={selectedCall.avatar}
                style={styles.detailsAvatar}
              />
              <Text style={styles.detailsName}>{selectedCall.name}</Text>
              <Text style={styles.detailsPhone}>{selectedCall.phone}</Text>
              <Text style={styles.detailsTime}>{selectedCall.time}</Text>

              <View style={styles.detailsInfo}>
                <Ionicons
                  name={
                    selectedCall.type === "incoming" ? "arrow-down" : "arrow-up"
                  }
                  size={20}
                  color={selectedCall.type === "missed" ? "#ff3b30" : "#34c759"}
                />
                <Text style={styles.detailsType}>
                  {selectedCall.type === "incoming"
                    ? "Incoming"
                    : selectedCall.type === "outgoing"
                    ? "Outgoing"
                    : "Missed"}{" "}
                  call
                </Text>
                {selectedCall.duration && (
                  <Text style={styles.detailsDuration}>
                    {selectedCall.duration}
                  </Text>
                )}
                {selectedCall.video && (
                  <Ionicons name="videocam" size={20} color="#666" />
                )}
              </View>

              <View style={styles.detailsMeta}>
                <TouchableOpacity
                  style={styles.metaButton}
                  onPress={() => toggleFavorite(selectedCall.id)}
                >
                  <Ionicons
                    name={selectedCall.isFavorite ? "star" : "star-outline"}
                    size={24}
                    color={selectedCall.isFavorite ? "#FFD700" : "#666"}
                  />
                  <Text style={styles.metaButtonText}>
                    {selectedCall.isFavorite ? "Favorite" : "Add to favorites"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.metaButton}
                  onPress={() => toggleMute(selectedCall.id)}
                >
                  <Ionicons
                    name={selectedCall.isMuted ? "volume-mute" : "volume-high"}
                    size={24}
                    color="#666"
                  />
                  <Text style={styles.metaButtonText}>
                    {selectedCall.isMuted ? "Muted" : "Mute notifications"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.callLogSection}>
                <Text style={styles.sectionTitle}>Call History</Text>
                {selectedCall.callLog?.map((log, index) => (
                  <View key={index} style={styles.callLogItem}>
                    <Ionicons
                      name="time"
                      size={16}
                      color="#666"
                      style={styles.callLogIcon}
                    />
                    <Text style={styles.callLogText}>{log}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.detailsActions}>
                <TouchableOpacity
                  style={styles.detailsActionButton}
                  onPress={() => handleCallPress(selectedCall.phone)}
                >
                  <View style={styles.actionButtonCircle}>
                    <Ionicons name="call" size={24} color="#fff" />
                  </View>
                  <Text style={styles.detailsActionText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.detailsActionButton}
                  onPress={() => handleVideoCallPress(selectedCall.phone)}
                >
                  <View style={styles.actionButtonCircle}>
                    <Ionicons name="videocam" size={24} color="#fff" />
                  </View>
                  <Text style={styles.detailsActionText}>Video</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.detailsActionButton}
                  onPress={() => {
                    setSelectedCall(null);
                    navigation.navigate("ContactInfo", {
                      contact: selectedCall,
                    });
                  }}
                >
                  <View style={styles.actionButtonCircle}>
                    <Ionicons
                      name="information-circle"
                      size={24}
                      color="#fff"
                    />
                  </View>
                  <Text style={styles.detailsActionText}>Info</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 15,
    backgroundColor: "#008069",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 2,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 18,
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  tabText: {
    color: "#fff",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#008069",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  listContainer: {
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
  createCallLink: {
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e5e5",
  },
  createCallIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e5f5e5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  createCallText: {
    fontSize: 16,
    color: "#008069",
    fontWeight: "500",
  },
  createCallSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  callItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e5e5",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  favoriteBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#FFD700",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  callInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 3,
    flexShrink: 1,
  },
  businessIcon: {
    marginLeft: 5,
  },
  callDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  callIcon: {
    marginRight: 5,
  },
  time: {
    fontSize: 14,
    color: "#666",
  },
  missedCall: {
    color: "#ff3b30",
  },
  callLogContainer: {
    marginTop: 8,
  },
  callLogItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  callLogText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  callActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  duration: {
    fontSize: 14,
    color: "#666",
    marginRight: 15,
  },
  callButton: {
    padding: 5,
  },
  floatingButtons: {
    position: "absolute",
    bottom: 30,
    right: 30,
    flexDirection: "column",
    alignItems: "flex-end",
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: 15,
  },
  voiceCallButton: {
    backgroundColor: "#008069",
  },
  videoCallButton: {
    backgroundColor: "#128C7E",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  filterModalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e5e5",
  },
  filterOptionText: {
    fontSize: 16,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  modalOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e5f5e5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  modalOptionSubtext: {
    fontSize: 14,
    color: "#666",
  },
  modalDivider: {
    height: 0.5,
    backgroundColor: "#e5e5e5",
    marginVertical: 10,
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 15,
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 16,
    color: "#008069",
    fontWeight: "500",
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e5e5",
  },
  backButton: {
    padding: 5,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  detailsContent: {
    alignItems: "center",
    padding: 20,
  },
  detailsAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  detailsName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 5,
    textAlign: "center",
  },
  detailsPhone: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
    textAlign: "center",
  },
  detailsTime: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  detailsInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  detailsType: {
    fontSize: 16,
    marginLeft: 10,
    marginRight: 15,
  },
  detailsDuration: {
    fontSize: 16,
    color: "#666",
    marginRight: 10,
  },
  detailsMeta: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  metaButton: {
    alignItems: "center",
    padding: 10,
  },
  metaButtonText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  callLogSection: {
    width: "100%",
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#008069",
  },
  callLogIcon: {
    marginRight: 10,
  },
  detailsActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  detailsActionButton: {
    alignItems: "center",
    minWidth: 80,
  },
  actionButtonCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#008069",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  detailsActionText: {
    fontSize: 14,
    color: "#666",
  },
});

export default Calls;
