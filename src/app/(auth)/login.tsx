import ButtonComp from '@/src/components/atoms/ButtonComp';
import { COUNTRIES } from '@/src/constants/countries';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const onNextButtonclick = () => {
    router.push('/(auth)/verify_otp')
  }

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.heading_container}>
          <Text style={styles.heading}>Enter your phone number</Text>
          <Text style={styles.description}>
            WhatsApp will need to verify your phone number.{' '}
            <Text style={styles.link_description}>What is a phone number?</Text>
          </Text>
        </View>

        {/* INPUT SECTION */}
        <View style={styles.input_main_container}>
          {/* COUNTRY DROPDOWN */}
          <TouchableOpacity
            style={styles.dropDown_container}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.dropDown_title}>{selectedCountry.name}</Text>
            <AntDesign name="caretdown" size={14} color="black" />
          </TouchableOpacity>
          <View style={styles.horizontal_line} />

          {/* PHONE NUMBER FIELD */}
          <View style={styles.phone_input_container}>
            <View style={styles.country_code_container}>
              <Text style={styles.country_code}>{selectedCountry.code}</Text>
            </View>
            <View style={styles.vertical_line} />
            <TextInput
              style={styles.phone_input}
              placeholder="Phone number"
              placeholderTextColor="gray"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <View style={styles.horizontal_line} />
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <ButtonComp
          title="Next"
          style={{ paddingHorizontal: scale(30) }}
          onPress={onNextButtonclick}
        />
      </View>

      {/* COUNTRY MODAL - Bottom Sheet */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* HEADER */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={20} color="black" />
              </TouchableOpacity>
            </View>

            {/* LIST */}
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => selectCountry(item)}
                >
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryCode}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: verticalScale(70),
    paddingHorizontal: scale(20),
  },
  header: {
    gap: verticalScale(30),
    alignItems: 'center',
    width: '100%',
  },
  footer: {
    alignItems: 'center',
  },
  heading_container: {
    alignItems: 'center',
    gap: verticalScale(10),
    paddingHorizontal: scale(10),
  },
  input_main_container: {
    width: '100%',
    gap: verticalScale(10),
  },
  heading: {
    fontSize: moderateScale(20),
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: moderateScale(13),
    color: 'gray',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: verticalScale(18),
  },
  link_description: {
    color: '#0ccc83',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  horizontal_line: {
    height: verticalScale(1),
    backgroundColor: '#0ccc83',
    alignSelf: 'stretch',
  },
  dropDown_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(15),
    backgroundColor: '#fff',
  },
  dropDown_title: {
    fontSize: moderateScale(15),
    color: 'black',
    fontWeight: 'bold',
  },
  phone_input_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
  },
  country_code_container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(10),
  },
  country_code: {
    fontSize: moderateScale(15),
    color: 'black',
    fontWeight: 'bold',
  },
  vertical_line: {
    width: verticalScale(1),
    height: '100%',
    backgroundColor: '#0ccc83',
  },
  phone_input: {
    flex: 1,
    fontSize: moderateScale(15),
    color: 'black',
    paddingHorizontal: scale(10),
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // dim background
    justifyContent: 'flex-end', // align to bottom
  },
  modalContent: {
    backgroundColor: 'white',
    paddingTop: scale(10),
    paddingBottom: scale(20),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  countryItem: {
    padding: scale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countryName: {
    fontSize: moderateScale(15),
  },
  countryCode: {
    fontSize: moderateScale(15),
    color: 'gray',
  },
});
