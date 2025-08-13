import imagePath from '@/src/constants/imagePath';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(true); 
      router.push('/(auth)/terms_agree');
    }, 2000);

    return () => clearTimeout(timeout); 
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}></View>

      <View style={styles.body}>
        <Image source={imagePath.logo} style={styles.logo_style} resizeMode="contain" />
        <Text style={styles.whatsapp_text}>Whatsapp</Text>
      </View>

      <View style={styles.footer}>
        {
          isLoading ? (
            <>
              <ActivityIndicator size={moderateScale(50)} color={'#0ccc83'} />
              <Text style={styles.loading_text}>Loading...</Text>
            </>
          ) : (
            <>
              <Text style={styles.from_text}>From</Text>
              <Text style={styles.facebook_text}>Facebook</Text>
            </>
          )
        }
      </View>
    </SafeAreaView>
  );
};

export default Auth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(70),
  },
  header: {},
  body: {
    alignItems: 'center',
    gap: verticalScale(20),
  },
  footer: {
    alignItems: 'center',
    height: verticalScale(60),
    justifyContent: 'flex-end',
  },
  from_text: {
    fontSize: moderateScale(12),
    color: 'gray',
  },
  facebook_text: {
    fontSize: moderateScale(20),
  },
  logo_style: {
    width: moderateScale(50),
    height: moderateScale(50),
  },
  whatsapp_text: {
    fontSize: moderateScale(20),
  },
  loading_text: {
    fontSize: moderateScale(12),
  },
});
