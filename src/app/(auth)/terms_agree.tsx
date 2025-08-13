import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import React from 'react';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import imagePath from '@/src/constants/imagePath';
import ButtonComp from '@/src/components/atoms/ButtonComp';
import { router } from 'expo-router';

const TermsAgree = () => {
    const onAgree = () => {
        router.push('/(auth)/login');
        
    }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.whatsapp_text}>Welcome to Whatsapp</Text>
        <Image source={imagePath.welcome} resizeMode='contain' style={styles.image_style}/>
        <Text style={styles.description_text}>Read our <Text style={styles.link_text}>Privacy Policy. </Text>Tap “Agree and continue” to 
                    accept the <Text style={styles.link_text}>Teams of Service.</Text></Text>
                    <View style={{width: moderateScale(300), marginTop: verticalScale(20)}}>
            <ButtonComp title='Agree and continue' onPress={onAgree} />
            </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.from_text}>From</Text>
        <Text style={styles.facebook_text}>Facebook</Text>
      </View>
    </SafeAreaView>
  );
};

export default TermsAgree;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: verticalScale(85),
    paddingHorizontal: scale(30),
    
  },
  header: {
    gap: verticalScale(30),
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  from_text: {
    fontSize: moderateScale(12),
    color: 'gray',
  },
  facebook_text: {
    fontSize: moderateScale(15),
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  whatsapp_text: {
    fontSize: moderateScale(30),
    fontWeight: 'bold',
    marginBottom: verticalScale(10),
  },
  image_style: {
    width: moderateScale(250),
    height: moderateScale(250),
    borderRadius: moderateScale(250),
  },
  description_text: {
    fontSize: moderateScale(13),
    textAlign: 'center',
    color:'black',
  },
  link_text: {
    color:'#0ccc83',
  }
});
