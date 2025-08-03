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

const Login = () => {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState(["", "", "", "", ""]);
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pinRefs = useRef(pin.map(() => React.createRef()));
  const router = useRouter();

  const handlePinChange = (text, index) => {
    if (/^[0-9]?$/.test(text)) {
      const newPin = [...pin];
      newPin[index] = text;
      setPin(newPin);

      if (text && index < 4) {
        pinRefs.current[index + 1].current.focus();
      } else if (!text && index > 0) {
        pinRefs.current[index - 1].current.focus();
      }
    }
  };

  const handlePinPaste = (text) => {
    if (/^\d{5}$/.test(text)) {
      setPin(text.split(""));
    }
  };

  const handleLogin = async () => {
    if (!email || pin.some((digit) => digit === "")) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Login successful!");
      router.push('/dashboard'); // Uncomment when dashboard route is added
    }, 2000);
  };

  const EyeIcon = ({ show }) => (
    <View style={styles.eyeIcon}>
      <View style={[styles.eyeOuter, !show && styles.eyeClosed]} />
      {show && <View style={styles.eyeInner} />}
    </View>
  );

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
          {/* Header */}
          <View style={styles.header}>
            <BankIcon />
            <Text style={styles.subtitleText}>Sign in to your account</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
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
            {/* PIN Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>PIN</Text>
              <View style={styles.pinContainer}>
                {pin.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={pinRefs.current[index]}
                    style={styles.pinInput}
                    value={digit}
                    onChangeText={(text) => handlePinChange(text, index)}
                    onPaste={(e) => handlePinPaste(e.nativeEvent.text)}
                    keyboardType="numeric"
                    maxLength={1}
                    secureTextEntry={!showPin}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textAlign="center"
                  />
                ))}
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPin(!showPin)}
                >
                  <EyeIcon show={showPin} />
                </TouchableOpacity>
              </View>
            </View>
            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={() => router.push("/forget_password")}
            >
              <Text style={styles.forgotPasswordText}>Forgot PIN?</Text>
            </TouchableOpacity>
            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>
            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>
            {/* Biometric Login */}
            <TouchableOpacity style={styles.biometricButton}>
              <View style={styles.fingerprintIcon} />
              <Text style={styles.biometricText}>Use Fingerprint</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={styles.signupText}>Sign Up</Text>
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
    paddingBottom: 40,
    backgroundColor: "#ffffff",
  },
  bankIconContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  bankBuilding: {
    width: 80,
    height: 60,
    backgroundColor: "#1e40af",
    borderRadius: 8,
  },
  bankPillar1: {
    position: "absolute",
    top: 15,
    left: 10,
    width: 8,
    height: 45,
    backgroundColor: "#ffffff",
    borderRadius: 4,
  },
  bankPillar2: {
    position: "absolute",
    top: 15,
    left: 36,
    width: 8,
    height: 45,
    backgroundColor: "#ffffff",
    borderRadius: 4,
  },
  bankPillar3: {
    position: "absolute",
    top: 15,
    right: 10,
    width: 8,
    height: 45,
    backgroundColor: "#ffffff",
    borderRadius: 4,
  },
  bankRoof: {
    position: "absolute",
    top: -5,
    width: 90,
    height: 20,
    backgroundColor: "#374151",
    borderRadius: 4,
  },
  bankText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e40af",
    letterSpacing: 2,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "400",
  },
  formContainer: {
    flex: 1,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    height: 56,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1f2937",
    backgroundColor: "#f9fafb",
  },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
  },
  pinInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    fontSize: 24,
    color: "#1f2937",
    textAlign: "center",
  },
  eyeButton: {
    padding: 16,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeOuter: {
    width: 20,
    height: 12,
    borderWidth: 2,
    borderColor: "#6b7280",
    borderRadius: 10,
  },
  eyeClosed: {
    borderTopWidth: 0,
    borderBottomWidth: 2,
    height: 2,
    marginTop: 5,
  },
  eyeInner: {
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: "#6b7280",
    borderRadius: 4,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#1e40af",
    fontWeight: "600",
  },
  loginButton: {
    height: 56,
    backgroundColor: "#1e40af",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    elevation: 3,
    shadowColor: "#1e40af",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loginButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  biometricButton: {
    height: 56,
    borderWidth: 2,
    borderColor: "#1e40af",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  fingerprintIcon: {
    width: 24,
    height: 24,
    backgroundColor: "#1e40af",
    borderRadius: 12,
    marginRight: 12,
  },
  biometricText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e40af",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 16,
    color: "#6b7280",
  },
  signupText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e40af",
  },
});

export default Login;