import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

const Dashboard = () => {
  const [balance] = useState("950,000");
  const [accountNumber] = useState("9061512740");
  const router = useRouter();

  const favoriteContacts = [
    { id: 1, name: "New", avatar: "👤", isAddNew: true },
    { id: 2, name: "adyems", avatar: "👨🏽‍💼", color: "#8B4513" },
    { id: 3, name: "Ellie", avatar: "👨🏻‍💻", color: "#4A90E2" },
    { id: 4, name: "cindy", avatar: "👨🏽‍🦱", color: "#F5A623" },
    { id: 5, name: "tamino", avatar: "👨🏻‍🎓", color: "#7ED321" },
    { id: 6, name: "Bi...", avatar: "👩🏻‍💼", color: "#D0021B" },
  ];

  const recentTransactions = [
    {
      id: 1,
      type: "receive",
      title: "Receive from Oji",
      amount: "+₦200",
      time: "Today, 07:23 AM",
      isPositive: true,
    },
    {
      id: 2,
      type: "send",
      title: "Send to Rizal",
      amount: "-₦150",
      time: "Yesterday, 05:23 PM",
      isPositive: false,
    },
  ];

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

  const handleBottomNavPress = (tab) => {
    Alert.alert("Navigation", `${tab} tab pressed`);
    // Example navigation: router.push(`/${tab.toLowerCase()}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
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

        {/* Balance Card */}
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

        {/* Action Buttons */}
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

        {/* Favorite Contacts */}
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
            {favoriteContacts.map((contact) => (
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
            ))}
          </ScrollView>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transaction</Text>
            <TouchableOpacity onPress={handleViewAllTransactions}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.transactionsContainer}>
            {recentTransactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                style={styles.transactionItem}
              >
                <View
                  style={[
                    styles.transactionIcon,
                    transaction.type === "receive"
                      ? styles.receiveIcon
                      : styles.sendIconBg,
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
                  {transaction.amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
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
          <MaterialIcons
            name="account-balance-wallet"
            size={24}
            color="#6b7280"
          />
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
    paddingTop: 40, // Increased to push content down
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
});

export default Dashboard;