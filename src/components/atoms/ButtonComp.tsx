import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'

const ButtonComp = ({title, onPress, style}:any) => {
  return (
    <TouchableOpacity   style={[styles.button_container, style]} activeOpacity={0.8} onPress={onPress}>
      <Text style={styles.button_text}>{title}</Text>
    </TouchableOpacity>
  )
}

export default ButtonComp

const styles = StyleSheet.create({
    button_container: {
        backgroundColor: '#0ccc83',
        borderRadius: moderateScale(5),
        width: '100%',
        paddingVertical: verticalScale (10),
        paddingHorizontal: scale(10),
        alignItems: 'center',
    },
    button_text: {
        color: 'white',
        fontSize: moderateScale(15),
        textAlign: 'center',
    }
})



