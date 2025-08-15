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
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window");

const API_BASE_URL = 'http://192.168.216.38/zamanipay/backend';

const Dashboard = () => {
  const { email: paramEmail, full_name, user_id } = useLocalSearchParams();
  const [email, setEmail] = useState(paramEmail || '');
  const [balance, setBalance] = useState("0.00");
  const [accountNumber, setAccountNumber] = useState("");
  const [contacts, setContacts] = useState([{ id: 0, name: "New", isAddNew: true }]);
  const [transactions, setTransactions] = useState([]);
  const [showFingerprintModal, setShowFingerprintModal] = useState(false);
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

  const fetchDashboardData = async () => {
    if (!email) {
      console.log("No email provided to fetchDashboardData");
      setError("No email provided. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Fetching data for email:", email);
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
        setContacts([
          { id: 0, name: "New", isAddNew: true },
          ...(result.data?.contacts || []).map((c, i) => ({
            id: i + 1,
            name: c.contact_name || "Unknown",
            avatar: c.avatar_emoji || "👤",
            color: c.color || "#4A90E2",
          })),
        ]);
        setTransactions(
          (result.data?.transactions || []).map((t, i) => ({
            ...t,
            id: i + 1,
          }))
        );
        if (!result.data?.has_fingerprint) {
          setShowFingerprintModal(true);
        }
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
      console.log("Dashboard mounted with params:", { email, full_name, user_id });
      console.log("State values:", { balance, accountNumber, contacts, transactions });
      fetchDashboardData();
    }
  }, [email]);

  const handleEnableFingerprint = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        Alert.alert("Error", "Device does not support biometrics");
        return;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        Alert.alert("Error", "No biometrics enrolled on device");
        return;
      }

      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable fingerprint',
        fallbackLabel: 'Use PIN',
      });

      if (!authResult.success) {
        Alert.alert("Error", "Biometric authentication failed");
        return;
      }

      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/enable_fingerprint.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, enable: true }),
      });

      const responseText = await response.text();
      console.log("Fingerprint enable raw response:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        throw new Error(`JSON Parse error: ${jsonError.message}, Response: ${responseText}`);
      }
      console.log("Fingerprint enable parsed response:", result);

      if (result.success) {
        Alert.alert("Success", result.message);
        setShowFingerprintModal(false);
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      console.error("Fingerprint enable error:", error.message);
      Alert.alert("Error", "Failed to enable fingerprint: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAccount = () => {
    Alert.alert("Copied", "Account number copied to clipboard");
  };

  const handleRequest = () => {
    Alert.alert("Request", "Request money feature");
  };

  const handleSend = () => {
    Alert.alert("Send", "Send money feature");
  };

  const handleQRCode = () => {
    Alert.alert("QR Code", "QR Code scanner");
  };

  const handleContactPress = (contact) => {
    if (contact.isAddNew) {
      Alert.alert("Add Contact", "Add new contact feature");
    } else {
      Alert.alert("Contact", `Selected ${contact.name}`);
    }
  };

  const handleViewAllFavorites = () => {
    Alert.alert("View All", "View all favorite contacts");
  };

  const handleViewAllTransactions = () => {
    Alert.alert("View All", "View all transactions");
  };

  const handleBottomNavPress = async (tab) => {
    if (tab === "Account") {
      router.push({
        pathname: '/profile',
        params: { email, full_name, user_id },
      });
    } else if (tab === "Pocket") {
      router.push({
        pathname: '/pocket',
        params: { email, full_name, user_id },
      });
    } else if (tab === "Pay") {
      router.push({
        pathname: '/pay',
        params: { email, full_name, user_id },
      });
    } else if (tab === "Home") {
      fetchDashboardData();
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
            onPress={fetchDashboardData}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        visible={showFingerprintModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFingerprintModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enable Fingerprint Login</Text>
            <Text style={styles.modalText}>
              Would you like to enable fingerprint login for faster and secure access?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, isLoading && styles.modalButtonDisabled]}
                onPress={handleEnableFingerprint}
                disabled={isLoading}
              >
                <Text style={styles.modalButtonText}>
                  {isLoading ? "Enabling..." : "Enable Fingerprint"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowFingerprintModal(false)}
              >
                <Text style={styles.modalButtonText}>Not Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.appName}>ZamaniPay</Text>
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
          <Text style={styles.balanceLabel}>Main Balance</Text>
          <Text style={styles.balanceAmount}>₦{balance}</Text>
          <View style={styles.accountNumberContainer}>
            <Text style={styles.accountNumber}>{accountNumber}</Text>
            <TouchableOpacity
              onPress={handleCopyAccount}
              style={styles.copyButton}
            >
              <MaterialIcons name="content-copy" size={16} color="#c7d2fe" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleRequest}>
            <MaterialIcons name="arrow-downward" size={24} color="#374151" />
            <Text style={styles.actionButtonText}>Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleSend}>
            <MaterialIcons name="arrow-upward" size={24} color="#374151" />
            <Text style={styles.actionButtonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleQRCode}>
            <MaterialIcons name="qr-code" size={24} color="#374151" />
            <Text style={styles.actionButtonText}>QR Code</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Favorite</Text>
            <TouchableOpacity onPress={handleViewAllFavorites}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.contactsContainer}
          >
            {contacts.length === 1 && contacts[0].isAddNew ? (
              <Text style={styles.emptyText}>No favorite contacts yet</Text>
            ) : (
              contacts.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  style={styles.contactItem}
                  onPress={() => handleContactPress(contact)}
                >
                  <View
                    style={[
                      styles.contactAvatar,
                      contact.isAddNew
                        ? styles.addNewAvatar
                        : { backgroundColor: contact.color },
                    ]}
                  >
                    {contact.isAddNew ? (
                      <Text style={styles.addNewIcon}>+</Text>
                    ) : (
                      <Text style={styles.contactEmoji}>{contact.avatar}</Text>
                    )}
                  </View>
                  <Text style={styles.contactName}>{contact.name}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transaction</Text>
            <TouchableOpacity onPress={handleViewAllTransactions}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.transactionsContainer}>
            {transactions.length === 0 ? (
              <Text style={styles.emptyText}>No recent transactions</Text>
            ) : (
              transactions.map((transaction) => (
                <TouchableOpacity
                  key={transaction.id}
                  style={styles.transactionItem}
                >
                  <View
                    style={[
                      styles.transactionIcon,
                      transaction.type === "receive" ? styles.receiveIcon : styles.sendIconBg,
                    ]}
                  >
                    <MaterialIcons
                      name={
                        transaction.type === "receive"
                          ? "arrow-downward"
                          : "arrow-upward"
                      }
                      size={24}
                      color={
                        transaction.type === "receive" ? "#16a34a" : "#f59e0b"
                      }
                    />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle}>
                      {transaction.title}
                    </Text>
                    <Text style={styles.transactionTime}>{transaction.time}</Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      transaction.isPositive
                        ? styles.positiveAmount
                        : styles.negativeAmount,
                    ]}
                  >
                    {transaction.amount > 0 ? `+₦${transaction.amount}` : `-₦${Math.abs(transaction.amount)}`}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, styles.activeNavItem]}
          onPress={() => handleBottomNavPress("Home")}
        >
          <MaterialIcons name="home" size={24} color="#4f46e5" />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleBottomNavPress("Pocket")}
        >
          <MaterialIcons name="account-balance-wallet" size={24} color="#6b7280" />
          <Text style={styles.navText}>Pocket</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleBottomNavPress("Pay")}
        >
          <MaterialIcons name="payment" size={24} color="#6b7280" />
          <Text style={styles.navText}>Pay</Text>
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
  copyButton: {
    padding: 4,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  actionButton: {
    alignItems: "center",
    flex: 1,
  },
  actionButtonText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
    marginTop: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  viewAllText: {
    fontSize: 14,
    color: "#4f46e5",
    fontWeight: "600",
  },
  contactsContainer: {
    paddingVertical: 8,
  },
  contactItem: {
    alignItems: "center",
    marginRight: 20,
  },
  contactAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  addNewAvatar: {
    backgroundColor: "#f3f4f6",
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
  },
  addNewIcon: {
    fontSize: 24,
    color: "#6b7280",
    fontWeight: "300",
  },
  contactEmoji: {
    fontSize: 24,
  },
  contactName: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  transactionsContainer: {
    backgroundColor: "#ffffff",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  receiveIcon: {
    backgroundColor: "#dcfce7",
  },
  sendIconBg: {
    backgroundColor: "#fef3c7",
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 12,
    color: "#6b7280",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "700",
  },
  positiveAmount: {
    color: "#16a34a",
  },
  negativeAmount: {
    color: "#dc2626",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    width: width * 0.8,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#1e40af",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 8,
  },
  modalButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  modalCancelButton: {
    backgroundColor: "#6b7280",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
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
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    paddingVertical: 16,
  },
});

export default Dashboard;