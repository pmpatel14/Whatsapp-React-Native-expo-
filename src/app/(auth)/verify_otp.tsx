import ButtonComp from '@/src/components/atoms/ButtonComp';
import OTPInput from "@codsod/react-native-otp-input";
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';

const VerifyOtp = () => {
  const [otp, setOTP] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Clear error when OTP changes
  useEffect(() => {
    if (error) {
      setError("");
    }
  }, [otp]);

  const verifyOTP = async () => {
    if (isLoading) return; // Prevent multiple submissions
    if (otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call - replace with your actual verification logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, accept "1234" as valid OTP
      if (otp === "1234") {
        console.log("OTP Verified Successfully:", otp);
        
        // Store token securely
        await SecureStore.setItemAsync('accessToken', 'your-access-token-here');
        
        Alert.alert(
          "Success", 
          "OTP verified successfully!",
          [
            { 
              text: "OK", 
              onPress: () => router.push('/(main)')  // Navigate on OK press
            }
          ]
        );
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setIsLoading(true);
    setError("");
    setOTP(""); // Clear current OTP

    try {
      // Simulate API call for resending OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("OTP Resent");
      setCountdown(60); // Reset countdown
      
      Alert.alert(
        "OTP Sent", 
        "A new OTP has been sent to your phone",
        [{ text: "OK" }]
      );
    } catch (err) {
      console.error("Resend OTP Error:", err);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  // Create input style based on error state
  const getInputStyle = () => {
    if (error) {
      return [styles.OTPInput, styles.OTPInputError];
    }
    return styles.OTPInput;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.head}>
        <TouchableOpacity onPress={handleBackPress} disabled={isLoading}>
          <AntDesign 
            name="arrowleft" 
            size={24} 
            color={isLoading ? "#ccc" : "black"} 
            style={styles.backButton} 
          />
        </TouchableOpacity>
        <Text style={styles.headTitle}>Enter OTP</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.otpSendText}>OTP sent to +91 1********9</Text>

        <OTPInput
          length={4}
          onOtpComplete={(txt) => setOTP(txt)}
          style={styles.otpContainer}
          inputStyle={getInputStyle()}
          value={otp}
          editable={!isLoading}
        />

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <View style={styles.resendContainer}>
          {countdown > 0 ? (
            <Text style={styles.resendText}>
              Resend OTP Code in <Text style={styles.counterText}>{countdown}</Text> s
            </Text>
          ) : (
            <TouchableOpacity 
              onPress={resendOTP} 
              disabled={isLoading}
              style={styles.resendButton}
            >
              <Text style={[
                styles.resendLinkText,
                isLoading ? styles.disabledText : null
              ]}>
                {isLoading ? "Sending..." : "Resend OTP Code"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <ButtonComp
          title={isLoading ? "Verifying..." : "Verify"}
          onPress={verifyOTP}
          style={[
            styles.verifyButton,
            (otp.length !== 4 || isLoading) ? styles.disabledButton : null
          ]}
          disabled={otp.length !== 4 || isLoading}
        />
      </View>
    </SafeAreaView>
  )
}

export default VerifyOtp

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(20),
    backgroundColor: "#F8F9FA",
    justifyContent: "space-between",
    paddingTop: moderateScale(40),
  },

  /* Header */
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  backButton: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
  headTitle: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#333",
  },

  /* Body */
  body: {
    alignItems: 'center',
    gap: moderateScale(20),
  },
  otpSendText: {
    fontSize: moderateScale(16),
    fontWeight: '400',
    color: "#555",
    textAlign: 'center',
  },
  
  /* Resend Section */
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: moderateScale(14),
    color: "#777",
  },
  counterText: {
    color: '#00cc99',
    fontWeight: "600",
  },
  resendButton: {
    paddingVertical: moderateScale(5),
  },
  resendLinkText: {
    fontSize: moderateScale(14),
    color: '#00cc99',
    fontWeight: "600",
    textDecorationLine: 'underline',
  },
  disabledText: {
    color: '#ccc',
    textDecorationLine: 'none',
  },

  /* OTP Styling */
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: scale(15),
  },
  OTPInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: moderateScale(8),
    color: "black",
    width: scale(50),
    height: scale(55),
    fontSize: moderateScale(20),
    textAlign: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  OTPInputError: {
    borderColor: "#ff4444",
    borderWidth: 2,
  },

  /* Error Text */
  errorText: {
    fontSize: moderateScale(12),
    color: "#ff4444",
    textAlign: 'center',
    marginTop: moderateScale(-10),
  },

  /* Footer */
  footer: {
    paddingBottom: moderateScale(20),
  },
  verifyButton: {
    backgroundColor: '#00cc99',
    borderRadius: moderateScale(20),
    paddingVertical: moderateScale(14),
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
})
