import React from "react";
import { View } from "react-native";
import MessageCart from "./MessageCart";

const Chats = () => {
  return (
    <View style={{ flex: 1 }}>
      <MessageCart />

      <MessageCart
        name="Bob Brown"
        message="Let's catch up later."
        time="12:15 PM"
        unreadCount={0}
      />
      <MessageCart
        name="Charlie White"
        message="How's the project going?"
        time="11:00 AM"
        unreadCount={3}
      />
      <MessageCart
        name="Diana Green"
        message="Can you send me the report?"
        time="10:30 AM"
        unreadCount={1}
      />
    </View>
  );
};

export default Chats;
