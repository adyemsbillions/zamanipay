import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Switch,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.216.38/zamanipay/backend';

const Profile = () => {
  const { email: paramEmail, full_name, user_id } = useLocalSearchParams();
  const [email, setEmail] = useState(paramEmail || '');
  const [fullName, setFullName] = useState(full_name || 'User');
  const [userId, setUserId] = useState(user_id || '');
  const [accountNumber, setAccountNumber] = useState('Not set');
  const [isFingerprintEnabled, setIsFingerprintEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load user data from AsyncStorage if not provided via params
        if (!email) {
          const userData = await AsyncStorage.getItem('userData');
          if (userData) {
            const { email: storedEmail, full_name: storedFullName, user_id: storedUserId } = JSON.parse(userData);
            setEmail(storedEmail || '');
            setFullName(storedFullName || 'User');
            setUserId(storedUserId || '');
          }
        }

        // Fetch profile data
        if (email) {
          fetchProfileData();
        } else {
          setError("No email provided. Please log in again.");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to load user data:", error.message);
        setError("Failed to load user data: " + error.message);
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [email]);

  const fetchProfileData = async () => {
    try {
      console.log("Fetching profile data for email:", email);
      const response = await fetch(`${API_BASE_URL}/get_dashboard_data.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log("Profile fetch response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error: ${response.status}, Response: ${errorText}`);
      }

      const responseText = await response.text();
      console.log("Profile raw response:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        throw new Error(`JSON Parse error: ${jsonError.message}, Response: ${responseText}`);
      }
      console.log("Profile parsed API response:", result);

      if (result.success) {
        setAccountNumber(result.data?.account_number || 'Not set');
        setIsFingerprintEnabled(!!result.data?.has_fingerprint);
        setFullName(result.data?.full_name || fullName);
      } else {
        setError(result.message || "Failed to load profile data");
      }
    } catch (error) {
      console.error("Profile fetch error:", error.message);
      setError(`Failed to fetch profile data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFingerprint = async () => {
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

      if (!isFingerprintEnabled) {
        // Authenticate before enabling
        const authResult = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to enable fingerprint',
          fallbackLabel: 'Use PIN',
        });

        if (!authResult.success) {
          Alert.alert("Error", "Biometric authentication failed");
          return;
        }
      }

      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/enable_fingerprint.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          enable: !isFingerprintEnabled,
        }),
      });

      const responseText = await response.text();
      console.log("Fingerprint toggle raw response:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        throw new Error(`JSON Parse error: ${jsonError.message}, Response: ${responseText}`);
      }
      console.log("Fingerprint toggle parsed response:", result);

      if (result.success) {
        setIsFingerprintEnabled(!isFingerprintEnabled);
        Alert.alert("Success", result.message);
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      console.error("Fingerprint toggle error:", error.message);
      Alert.alert("Error", "Failed to toggle fingerprint: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      router.replace("/login");
      Alert.alert("Success", "Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error.message);
      Alert.alert("Error", "Failed to log out: " + error.message);
    }
  };

  const handleCopyAccount = () => {
    Alert.alert("Copied", "Account number copied to clipboard");
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
            onPress={fetchProfileData}
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
          <Text style={styles.appName}>ZamaniPay</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialIcons name="notifications" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileEmoji}>🦊</Text>
          </View>
          <Text style={styles.profileName}>{fullName}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
          <View style={styles.accountNumberContainer}>
            <Text style={styles.accountNumber}>Account: {accountNumber}</Text>
            <TouchableOpacity
              onPress={handleCopyAccount}
              style={styles.copyButton}
            >
              <MaterialIcons name="content-copy" size={16} color="#c7d2fe" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Settings</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingDetails}>
              <MaterialIcons name="fingerprint" size={24} color="#374151" />
              <Text style={styles.settingText}>Fingerprint Login</Text>
            </View>
            <Switch
              value={isFingerprintEnabled}
              onValueChange={handleToggleFingerprint}
              trackColor={{ false: "#e5e7eb", true: "#4f46e5" }}
              thumbColor={isFingerprintEnabled ? "#ffffff" : "#f4f4f5"}
              disabled={isLoading}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert("Feature", "Update profile feature coming soon")}
          >
            <MaterialIcons name="edit" size={24} color="#374151" />
            <Text style={styles.actionButtonText}>Update Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/forget_password")}
          >
            <MaterialIcons name="lock" size={24} color="#374151" />
            <Text style={styles.actionButtonText}>Change PIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={24} color="#dc2626" />
            <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push({
            pathname: '/dashboard',
            params: { email, full_name: fullName, user_id: userId },
          })}
        >
          <MaterialIcons name="home" size={24} color="#6b7280" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => Alert.alert("Navigation", "Pocket tab pressed")}
        >
          <MaterialIcons name="account-balance-wallet" size={24} color="#6b7280" />
          <Text style={styles.navText}>Pocket</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => Alert.alert("Navigation", "Pay tab pressed")}
        >
          <MaterialIcons name="payment" size={24} color="#6b7280" />
          <Text style={styles.navText}>Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => Alert.alert("Navigation", "Statistic tab pressed")}
        >
          <MaterialIcons name="bar-chart" size={24} color="#6b7280" />
          <Text style={styles.navText}>Statistic</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, styles.activeNavItem]}
          onPress={() => {}}
        >
          <MaterialIcons name="person" size={24} color="#4f46e5" />
          <Text style={[styles.navText, styles.activeNavText]}>Account</Text>
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
  notificationButton: {
    padding: 8,
  },
  profileCard: {
    backgroundColor: "#4f46e5",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileEmoji: {
    fontSize: 40,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 16,
    color: "#e0e7ff",
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  settingDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
    fontWeight: "500",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  actionButtonText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
    fontWeight: "500",
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutButtonText: {
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
    shadowOffset: { width: 0, height: -2 },
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
export default Profile;