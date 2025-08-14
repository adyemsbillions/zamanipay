import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState(["", "", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const router = useRouter();
  const pinRefs = useRef([]);
  const confirmPinRefs = useRef([]);

  const handlePinChange = (value, index, isConfirm = false) => {
    if (/^[0-9]?$/.test(value)) {
      const newPin = isConfirm ? [...confirmPin] : [...pin];
      newPin[index] = value;

      if (isConfirm) {
        setConfirmPin(newPin);
      } else {
        setPin(newPin);
      }

      if (value && index < 4) {
        const nextRef = isConfirm
          ? confirmPinRefs.current[index + 1]
          : pinRefs.current[index + 1];
        nextRef?.focus();
      }
    }
  };

  const handleKeyPress = (e, index, isConfirm = false) => {
    if (e.nativeEvent.key === "Backspace" && index > 0) {
      const currentPin = isConfirm ? confirmPin : pin;
      if (!currentPin[index]) {
        const prevRef = isConfirm
          ? confirmPinRefs.current[index - 1]
          : pinRefs.current[index - 1];
        prevRef?.focus();
      }
    }
  };

  const handleSignup = async () => {
    if (!fullName || !email || !phoneNumber) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const pinString = pin.join("");
    const confirmPinString = confirmPin.join("");

    if (pinString.length !== 5) {
      Alert.alert("Error", "Please enter a 5-digit PIN");
      return;
    }

    if (pinString !== confirmPinString) {
      Alert.alert("Error", "PINs do not match");
      return;
    }

    if (!agreeToTerms) {
      Alert.alert("Error", "Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
   
      const response = await fetch('http://192.168.78.38/zamanipay/backend/signup.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone_number: phoneNumber,
          pin: pinString,
          confirm_pin: confirmPinString,
        }),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert("Success", result.message);
        router.push("/login");
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Network error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const BankIcon = () => (
    <View style={styles.bankIconContainer}>
      <View style={styles.bankBuilding} />
      <View style={styles.bankPillar1} />
      <View style={styles.bankPillar2} />
      <View style={styles.bankPillar3} />
      <View style={styles.bankRoof} />
      <Text style={styles.bankText}>ZamaniPay</Text>
    </View>
  );

  const CheckBox = ({ checked, onPress }) => (
    <TouchableOpacity style={styles.checkbox} onPress={onPress}>
      {checked && <View style={styles.checkboxInner} />}
    </TouchableOpacity>
  );

  const renderPinInputs = (pinArray, refs, isConfirm = false) => (
    <View style={styles.pinContainer}>
      {pinArray.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (isConfirm) {
              confirmPinRefs.current[index] = ref;
            } else {
              pinRefs.current[index] = ref;
            }
          }}
          style={[styles.pinInput, digit && styles.pinInputFilled]}
          value={digit}
          onChangeText={(value) => handlePinChange(value, index, isConfirm)}
          onKeyPress={(e) => handleKeyPress(e, index, isConfirm)}
          keyboardType="numeric"
          maxLength={1}
          secureTextEntry
          textAlign="center"
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <BankIcon />
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitleText}>
              Join our secure banking platform
            </Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your full name"
                placeholderTextColor="#9ca3af"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your phone number"
                placeholderTextColor="#9ca3af"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                autoCorrect={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Create 5-Digit PIN</Text>
              <Text style={styles.pinSubtext}>
                This will be used to secure your account
              </Text>
              {renderPinInputs(pin, pinRefs)}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm PIN</Text>
              {renderPinInputs(confirmPin, confirmPinRefs, true)}
            </View>
            <View style={styles.termsContainer}>
              <CheckBox
                checked={agreeToTerms}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
              />
              <Text style={styles.termsText}>
                I agree to the{" "}
                <Text style={styles.termsLink}>Terms & Conditions</Text> and{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.signupButton,
                isLoading && styles.signupButtonDisabled,
              ]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              <Text style={styles.signupButtonText}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
  },
  header: {
    alignItems: "center",
    paddingBottom: 30,
    backgroundColor: "#ffffff",
  },
  bankIconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  bankBuilding: {
    width: 60,
    height: 45,
    backgroundColor: "#1e40af",
    borderRadius: 6,
  },
  bankPillar1: {
    position: "absolute",
    top: 10,
    left: 8,
    width: 6,
    height: 35,
    backgroundColor: "#ffffff",
    borderRadius: 3,
  },
  bankPillar2: {
    position: "absolute",
    top: 10,
    left: 27,
    width: 6,
    height: 35,
    backgroundColor: "#ffffff",
    borderRadius: 3,
  },
  bankPillar3: {
    position: "absolute",
    top: 10,
    right: 8,
    width: 6,
    height: 35,
    backgroundColor: "#ffffff",
    borderRadius: 3,
  },
  bankRoof: {
    position: "absolute",
    top: -3,
    width: 68,
    height: 15,
    backgroundColor: "#374151",
    borderRadius: 3,
  },
  bankText: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e40af",
    letterSpacing: 1.5,
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 15,
    color: "#6b7280",
    fontWeight: "400",
  },
  formContainer: {
    flex: 1,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  textInput: {
    height: 52,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1f2937",
    backgroundColor: "#f9fafb",
  },
  pinSubtext: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 12,
  },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  pinInput: {
    width: 45,
    height: 52,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    backgroundColor: "#f9fafb",
    marginHorizontal: 3,
    textAlign: "center",
  },
  pinInputFilled: {
    borderColor: "#1e40af",
    backgroundColor: "#eff6ff",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: "#1e40af",
    borderRadius: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  termsLink: {
    color: "#1e40af",
    fontWeight: "600",
  },
  signupButton: {
    height: 52,
    backgroundColor: "#1e40af",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#1e40af",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  signupButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 15,
    color: "#6b7280",
  },
  loginText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e40af",
  },
});

export default Signup;