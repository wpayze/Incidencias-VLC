import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Page = () => {
  return (
    <View>
      <Text>Index</Text>
      <Link href={"/listing/12345"}>Go TO Issue</Link>
    </View>
  )
}

export default Page