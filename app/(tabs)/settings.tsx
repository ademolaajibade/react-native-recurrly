import {  Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";  




const Settings = () => {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-xl font-bold text-success">
        Settings
      </Text>
    </SafeAreaView>
  )
}

export default Settings