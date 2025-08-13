import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const MainStack = () => {
  return (
    <Stack screenOptions={{
      headerShown: false,}}>
      <Stack.Screen name='index' options={{ headerTitle: "chat" }}/>
    </Stack>
  )
}

export default MainStack