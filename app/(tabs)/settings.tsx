import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Page = () => {
  return (
    <View>
      <Text>Settings</Text>
      <Link href={"/(modals)/login"}>Login</Link>
    </View>
  )
}

export default Page