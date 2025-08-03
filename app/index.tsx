import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  const onboardingData = [
    {
      id: 1,
      title: "Bank with confidence",
      subtitle:
        "Secure transactions, instant transfers, and complete control over your finances with premium banking",
      illustration: "security",
    },
    {
      id: 2,
      title: "Smart investments",
      subtitle:
        "Grow your wealth with AI-powered investment recommendations and real-time market insights",
      illustration: "investment",
    },
    {
      id: 3,
      title: "Digital payments",
      subtitle:
        "Send money instantly, pay bills seamlessly, and manage all your payments in one secure app",
      illustration: "payments",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % onboardingData.length;

        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          scrollViewRef.current?.scrollTo({
            x: nextIndex * width,
            animated: false,
          });

          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });

        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [fadeAnim]);

  const handleNext = () => {
    if (currentIndex === onboardingData.length - 1) {
      router.push("/login");
    } else {
      const nextIndex = (currentIndex + 1) % onboardingData.length;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    }
  };

  const SecurityIllustration = () => (
    <View style={styles.illustrationContainer}>
      <View
        style={{
          ...styles.dot,
          backgroundColor: "#ff6b9d",
          top: 20,
          left: 30,
        }}
      />
      <View
        style={{
          ...styles.dot,
          backgroundColor: "#1e40af",
          top: 40,
          right: 20,
        }}
      />
      <View
        style={{
          ...styles.dot,
          backgroundColor: "#fbbf24",
          bottom: 60,
          left: 40,
        }}
      />
      <View
        style={{
          ...styles.dot,
          backgroundColor: "#10b981",
          bottom: 30,
          right: 50,
        }}
      />
      <View style={styles.shield} />
      <View style={styles.cape} />
      <View style={styles.vaultContainer}>
        <View style={styles.vault} />
        <View style={styles.vaultDoor} />
        <View style={styles.vaultHandle} />
        <View style={styles.lockIcon} />
      </View>
      <View style={styles.securityBadge1} />
      <View style={styles.securityBadge2} />
    </View>
  );

  const InvestmentIllustration = () => (
    <View style={styles.illustrationContainer}>
      <View
        style={{
          ...styles.dot,
          backgroundColor: "#ff6b9d",
          top: 20,
          left: 30,
        }}
      />
      <View
        style={{
          ...styles.dot,
          backgroundColor: "#1e40af",
          top: 40,
          right: 20,
        }}
      />
      <View
        style={{
          ...styles.dot,
          backgroundColor: "#fbbf24",
          bottom: 60,
          left: 40,
        }}
      />
      <View
        style={{
          ...styles.dot,
          backgroundColor: "#10b981",
          bottom: 30,
          right: 50,
        }}
      />
      <View style={styles.investmentBg} />
      <View style={styles.chartContainer}>
        <View style={styles.chartBar1} />
        <View style={styles.chartBar2} />
        <View style={styles.chartBar3} />
        <View style={styles.chartBar4} />
        <View style={styles.trendLine} />
      </View>
      <View style={styles.coin1} />
      <View style={styles.coin2} />
      <View style={styles.coin3} />
      <Text style={styles.dollarSign1}>$</Text>
      <Text style={styles.dollarSign2}>$</Text>
    </View>
  );

  const PaymentsIllustration = () => (
    <View style={styles.illustrationContainer}>
      <View
        style={{
          ...styles.dot,
          backgroundColor: "#ff6b9d",
          top: 20,
          left: 30,
        }}
      />
      <View
        style={{
          ...styles.dot,
          backgroundColor: "#1e40af",
          top: 40,
          right: 20,
        }}
      />
      <View
        style={{
          ...styles.dot,
          backgroundColor: "#fbbf24",
          bottom: 60,
          left: 40,
        }}
      />
      <View
        style={{
          ...styles.dot,
          backgroundColor: "#10b981",
          bottom: 30,
          right: 50,
        }}
      />
      <View style={styles.paymentsBg} />
      <View style={styles.creditCard1} />
      <View style={styles.creditCard2} />
      <View style={styles.phone} />
      <View style={styles.phoneScreen} />
      <View style={styles.paymentIcon1} />
      <View style={styles.paymentIcon2} />
      <View style={styles.paymentIcon3} />
      <View style={styles.transferArrow1} />
      <View style={styles.transferArrow2} />
    </View>
  );

  const renderIllustration = (type) => {
    switch (type) {
      case "security":
        return <SecurityIllustration />;
      case "investment":
        return <InvestmentIllustration />;
      case "payments":
        return <PaymentsIllustration />;
      default:
        return <SecurityIllustration />;
    }
  };

  const ArrowIcon = () => (
    <View style={styles.arrowContainer}>
      <View style={styles.arrowLine} />
      <View style={styles.arrowHead} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          style={styles.scrollView}
        >
          {onboardingData.map((item) => (
            <View key={item.id} style={styles.screen}>
              <View style={styles.illustrationWrapper}>
                {renderIllustration(item.illustration)}
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>
                  {item.title.split(" ").map((word, index) => (
                    <Text key={index}>
                      {word === "confidence" ||
                      word === "investments" ||
                      word === "payments" ? (
                        <Text style={styles.highlightedText}>{word}</Text>
                      ) : (
                        word
                      )}
                      {index < item.title.split(" ").length - 1 ? " " : ""}
                    </Text>
                  ))}
                </Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
      <View style={styles.pagination}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonOuterRing}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <ArrowIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  screen: {
    width,
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 100,
    paddingBottom: 100,
    alignItems: "center",
    justifyContent: "space-between",
  },
  illustrationWrapper: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  illustrationContainer: {
    width: 320,
    height: 320,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  dot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  shield: {
    width: 200,
    height: 220,
    backgroundColor: "#f8fafc",
    borderRadius: 100,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderWidth: 3,
    borderColor: "#e2e8f0",
    position: "absolute",
  },
  cape: {
    position: "absolute",
    right: 40,
    top: 70,
    width: 70,
    height: 110,
    backgroundColor: "#ef4444",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 35,
    transform: [{ rotate: "15deg" }],
  },
  vaultContainer: {
    alignItems: "center",
    zIndex: 10,
  },
  vault: {
    width: 80,
    height: 80,
    backgroundColor: "#374151",
    borderRadius: 10,
    marginBottom: 10,
  },
  vaultDoor: {
    position: "absolute",
    top: 5,
    width: 70,
    height: 70,
    backgroundColor: "#4b5563",
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#6b7280",
  },
  vaultHandle: {
    position: "absolute",
    top: 35,
    right: 15,
    width: 12,
    height: 12,
    backgroundColor: "#fbbf24",
    borderRadius: 6,
  },
  lockIcon: {
    position: "absolute",
    top: 30,
    width: 20,
    height: 20,
    backgroundColor: "#1e40af",
    borderRadius: 4,
  },
  securityBadge1: {
    position: "absolute",
    top: 50,
    left: 60,
    width: 25,
    height: 25,
    backgroundColor: "#10b981",
    borderRadius: 12.5,
  },
  securityBadge2: {
    position: "absolute",
    bottom: 80,
    right: 70,
    width: 20,
    height: 20,
    backgroundColor: "#1e40af",
    borderRadius: 10,
  },
  investmentBg: {
    width: 200,
    height: 200,
    backgroundColor: "#f0f9ff",
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#bae6fd",
    position: "absolute",
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    position: "absolute",
  },
  chartBar1: {
    width: 15,
    height: 30,
    backgroundColor: "#1e40af",
    marginHorizontal: 2,
    borderRadius: 2,
  },
  chartBar2: {
    width: 15,
    height: 50,
    backgroundColor: "#3b82f6",
    marginHorizontal: 2,
    borderRadius: 2,
  },
  chartBar3: {
    width: 15,
    height: 40,
    backgroundColor: "#60a5fa",
    marginHorizontal: 2,
    borderRadius: 2,
  },
  chartBar4: {
    width: 15,
    height: 60,
    backgroundColor: "#1e40af",
    marginHorizontal: 2,
    borderRadius: 2,
  },
  trendLine: {
    position: "absolute",
    top: -10,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#10b981",
    transform: [{ rotate: "15deg" }],
  },
  coin1: {
    position: "absolute",
    top: 40,
    left: 50,
    width: 30,
    height: 30,
    backgroundColor: "#fbbf24",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#f59e0b",
  },
  coin2: {
    position: "absolute",
    top: 60,
    right: 60,
    width: 25,
    height: 25,
    backgroundColor: "#fbbf24",
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: "#f59e0b",
  },
  coin3: {
    position: "absolute",
    bottom: 50,
    left: 70,
    width: 20,
    height: 20,
    backgroundColor: "#fbbf24",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#f59e0b",
  },
  dollarSign1: {
    position: "absolute",
    top: 30,
    right: 40,
    fontSize: 24,
    fontWeight: "bold",
    color: "#10b981",
  },
  dollarSign2: {
    position: "absolute",
    bottom: 40,
    right: 50,
    fontSize: 18,
    fontWeight: "bold",
    color: "#10b981",
  },
  paymentsBg: {
    width: 200,
    height: 200,
    backgroundColor: "#fef3c7",
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#fde68a",
    position: "absolute",
  },
  creditCard1: {
    position: "absolute",
    top: 60,
    left: 40,
    width: 60,
    height: 38,
    backgroundColor: "#1e40af",
    borderRadius: 8,
    transform: [{ rotate: "-15deg" }],
  },
  creditCard2: {
    position: "absolute",
    top: 70,
    left: 50,
    width: 60,
    height: 38,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    transform: [{ rotate: "10deg" }],
  },
  phone: {
    position: "absolute",
    right: 60,
    top: 50,
    width: 40,
    height: 70,
    backgroundColor: "#374151",
    borderRadius: 8,
  },
  phoneScreen: {
    position: "absolute",
    right: 63,
    top: 55,
    width: 34,
    height: 60,
    backgroundColor: "#60a5fa",
    borderRadius: 4,
  },
  paymentIcon1: {
    position: "absolute",
    bottom: 80,
    left: 60,
    width: 20,
    height: 20,
    backgroundColor: "#10b981",
    borderRadius: 10,
  },
  paymentIcon2: {
    position: "absolute",
    bottom: 60,
    right: 80,
    width: 15,
    height: 15,
    backgroundColor: "#f59e0b",
    borderRadius: 7.5,
  },
  paymentIcon3: {
    position: "absolute",
    top: 120,
    left: 80,
    width: 18,
    height: 18,
    backgroundColor: "#8b5cf6",
    borderRadius: 9,
  },
  transferArrow1: {
    position: "absolute",
    top: 100,
    left: 100,
    width: 30,
    height: 3,
    backgroundColor: "#10b981",
    transform: [{ rotate: "45deg" }],
  },
  transferArrow2: {
    position: "absolute",
    bottom: 100,
    right: 100,
    width: 25,
    height: 3,
    backgroundColor: "#1e40af",
    transform: [{ rotate: "-30deg" }],
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
    color: "#1f2937",
    lineHeight: 40,
  },
  highlightedText: {
    color: "#1e40af",
  },
  subtitle: {
    fontSize: 17,
    textAlign: "center",
    color: "#6b7280",
    lineHeight: 26,
    marginBottom: 30,
    fontWeight: "400",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: "#1e40af",
    width: 24,
  },
  buttonContainer: {
    alignItems: "center",
    paddingBottom: 30,
  },
  buttonOuterRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1e40af",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  arrowContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowLine: {
    width: 18,
    height: 2,
    backgroundColor: "white",
    position: "absolute",
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftColor: "white",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    position: "absolute",
    right: 3,
  },
});

export default OnboardingScreen;