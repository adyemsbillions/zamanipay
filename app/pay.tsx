import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  SafeAreaView,
  TextInput,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window");

const API_BASE_URL = 'http://192.168.216.38/zamanipay/backend';

const Pay = () => {
  const { email: paramEmail, full_name, user_id } = useLocalSearchParams();
  const [email, setEmail] = useState(paramEmail || '');
  const [balance, setBalance] = useState("0.00");
  const [accountNumber, setAccountNumber] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      if (!email) {
        try {
          const userData = await AsyncStorage.getItem('userData');
          if (userData) {
            const { email: storedEmail } = JSON.parse(userData);
            setEmail(storedEmail);
          }
        } catch (error) {
          console.error("Failed to load userData:", error.message);
        }
      }
    };
    loadUserData();
  }, []);

  const fetchPayData = async () => {
    if (!email) {
      console.log("No email provided to fetchPayData");
      setError("No email provided. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Fetching pay data for email:", email);
      const response = await fetch(`${API_BASE_URL}/get_dashboard_data.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error: ${response.status}, Response: ${errorText}`);
      }

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        throw new Error(`JSON Parse error: ${jsonError.message}, Response: ${responseText}`);
      }
      console.log("Parsed API response:", result);

      if (result.success) {
        setBalance(result.data?.balance || "0.00");
        setAccountNumber(result.data?.account_number || "Not set");
      } else {
        setError(result.message || "Failed to load data");
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      setError(`Failed to fetch data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      console.log("Pay mounted with params:", { email, full_name, user_id });
      fetchPayData();
    }
  }, [email]);

  const handleMakePayment = () => {
    if (!recipient || !amount) {
      Alert.alert("Error", "Please enter recipient and amount");
      return;
    }
    if (parseFloat(amount) > parseFloat(balance)) {
      Alert.alert("Error", "Insufficient balance");
      return;
    }
    Alert.alert("Success", `Payment of ₦${amount} to ${recipient} sent!`);
    // In real implementation, call backend API to process payment
  };

  const handleBottomNavPress = (tab) => {
    if (tab === "Home") {
      router.push({
        pathname: '/dashboard',
        params: { email, full_name, user_id },
      });
    } else {
      Alert.alert("Navigation", `${tab} tab pressed`);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchPayData}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.appName}>Pay</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton}>
              <MaterialIcons name="notifications" size={24} color="#374151" />
            </TouchableOpacity>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileEmoji}>🦊</Text>
            </View>
          </View>
        </View>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₦{balance}</Text>
          <View style={styles.accountNumberContainer}>
            <Text style={styles.accountNumber}>{accountNumber}</Text>
          </View>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Recipient Account</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter recipient account number"
              placeholderTextColor="#9ca3af"
              value={recipient}
              onChangeText={setRecipient}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Amount</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter amount"
              placeholderTextColor="#9ca3af"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity
            style={styles.payButton}
            onPress={handleMakePayment}
          >
            <Text style={styles.payButtonText}>Make Payment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleBottomNavPress("Home")}
        >
          <MaterialIcons name="home" size={24} color="#6b7280" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleBottomNavPress("Pocket")}
        >
          <MaterialIcons name="account-balance-wallet" size={24} color="#6b7280" />
          <Text style={styles.navText}>Pocket</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, styles.activeNavItem]}
          onPress={() => handleBottomNavPress("Pay")}
        >
          <MaterialIcons name="payment" size={24} color="#4f46e5" />
          <Text style={[styles.navText, styles.activeNavText]}>Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleBottomNavPress("Statistic")}
        >
          <MaterialIcons name="bar-chart" size={24} color="#6b7280" />
          <Text style={styles.navText}>Statistic</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleBottomNavPress("Account")}
        >
          <MaterialIcons name="person" size={24} color="#6b7280" />
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1f2937",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    marginRight: 16,
    padding: 8,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  profileEmoji: {
    fontSize: 20,
  },
  balanceCard: {
    backgroundColor: "#4f46e5",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#4f46e5",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#e0e7ff",
    marginBottom: 8,
    fontWeight: "500",
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 16,
  },
  accountNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  accountNumber: {
    fontSize: 14,
    color: "#c7d2fe",
    marginRight: 8,
    fontWeight: "500",
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
  payButton: {
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
  payButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  activeNavItem: {
    // Active state styling
  },
  navText: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: "500",
    marginTop: 4,
  },
  activeNavText: {
    color: "#4f46e5",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#1f2937",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#1e40af",
    borderRadius: 8,
    padding: 12,
  },
  retryButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
  },
});

export default Pay;