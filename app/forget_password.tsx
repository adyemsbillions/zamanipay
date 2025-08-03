import React, { useState } from "react";
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
} from "react-native";

const { width, height } = Dimensions.get("window");

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
    }, 2000);
  };

  const handleResendEmail = () => {
    setEmailSent(false);
    handleResetPassword();
  };

  const BankIcon = () => (
    <View style={styles.bankIconContainer}>
      <View style={styles.bankBuilding} />
      <View style={styles.bankPillar1} />
      <View style={styles.bankPillar2} />
      <View style={styles.bankPillar3} />
      <View style={styles.bankRoof} />
      <Text style={styles.bankText}>BANK</Text>
    </View>
  );

  const LockIcon = () => (
    <View style={styles.lockIconContainer}>
      <View style={styles.lockBody} />
      <View style={styles.lockShackle} />
      <View style={styles.lockKeyhole} />
    </View>
  );

  const EmailIcon = () => (
    <View style={styles.emailIconContainer}>
      <View style={styles.emailBody} />
      <View style={styles.emailFlap} />
      <View style={styles.emailLine1} />
      <View style={styles.emailLine2} />
    </View>
  );

  const BackArrow = () => (
    <View style={styles.backArrow}>
      <View style={styles.backArrowLine} />
      <View style={styles.backArrowHead} />
    </View>
  );

  if (emailSent) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <EmailIcon />
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successSubtitle}>
              We've sent password reset instructions to{"\n"}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>What's next?</Text>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>1</Text>
              </View>
              <Text style={styles.instructionText}>Check your email inbox</Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>2</Text>
              </View>
              <Text style={styles.instructionText}>
                Click the reset password link
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>3</Text>
              </View>
              <Text style={styles.instructionText}>
                Create your new password
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendEmail}
            >
              <Text style={styles.resendButtonText}>Resend Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={() => navigation?.navigate("Login")}
            >
              <Text style={styles.backToLoginText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Help */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              Didn't receive the email? Check your spam folder or{" "}
              <Text style={styles.helpLink}>contact support</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <BackArrow />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <LockIcon />
          <Text style={styles.welcomeText}>Forgot Password?</Text>
          <Text style={styles.subtitleText}>
            No worries! Enter your email address and we'll send you a link to
            reset your password.
          </Text>
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

          {/* Reset Button */}
          <TouchableOpacity
            style={[
              styles.resetButton,
              isLoading && styles.resetButtonDisabled,
            ]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <Text style={styles.resetButtonText}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember your password? </Text>
          <TouchableOpacity onPress={() => navigation?.navigate("Login")}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 50,
    marginBottom: 20,
    padding: 8,
  },
  backArrow: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrowLine: {
    width: 16,
    height: 2,
    backgroundColor: "#374151",
    position: "absolute",
  },
  backArrowHead: {
    width: 0,
    height: 0,
    borderRightWidth: 6,
    borderLeftWidth: 0,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderRightColor: "#374151",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    position: "absolute",
    left: 2,
  },
  header: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
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
  },
  lockIconContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  lockBody: {
    width: 40,
    height: 30,
    backgroundColor: "#1e40af",
    borderRadius: 6,
  },
  lockShackle: {
    position: "absolute",
    top: -15,
    width: 30,
    height: 30,
    borderWidth: 4,
    borderColor: "#1e40af",
    borderRadius: 15,
    borderBottomWidth: 0,
  },
  lockKeyhole: {
    position: "absolute",
    top: 8,
    width: 8,
    height: 8,
    backgroundColor: "#ffffff",
    borderRadius: 4,
  },
  emailIconContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  emailBody: {
    width: 60,
    height: 40,
    backgroundColor: "#1e40af",
    borderRadius: 6,
  },
  emailFlap: {
    position: "absolute",
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 30,
    borderRightWidth: 30,
    borderTopWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#3b82f6",
  },
  emailLine1: {
    position: "absolute",
    top: 15,
    width: 40,
    height: 2,
    backgroundColor: "#ffffff",
    borderRadius: 1,
  },
  emailLine2: {
    position: "absolute",
    top: 22,
    width: 30,
    height: 2,
    backgroundColor: "#ffffff",
    borderRadius: 1,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 12,
  },
  subtitleText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  emailText: {
    color: "#1e40af",
    fontWeight: "600",
  },
  formContainer: {
    flex: 1,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 32,
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
  resetButton: {
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
  resetButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  instructionsContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    backgroundColor: "#1e40af",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  instructionNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
  instructionText: {
    fontSize: 15,
    color: "#374151",
    flex: 1,
  },
  actionsContainer: {
    marginBottom: 32,
  },
  resendButton: {
    height: 56,
    backgroundColor: "#1e40af",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#1e40af",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resendButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  backToLoginButton: {
    height: 56,
    borderWidth: 2,
    borderColor: "#1e40af",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  backToLoginText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e40af",
  },
  helpContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  helpText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
  helpLink: {
    color: "#1e40af",
    fontWeight: "600",
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
  signInText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e40af",
  },
});

export default ForgotPassword;
