// app/streak.js
import { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { Box, Text, ScrollView } from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StreakScreen() {
    const TOTAL_LEVELS = 15;

    const [level, setLevel] = useState(1);

    // ICONS from URL 
    const ICON_BIG = "https://cdn-icons-png.flaticon.com/256/8722/8722283.png";
    const ICON_SMALL = "https://cdn-icons-png.flaticon.com/256/8722/8722283.png";
    const ICON_LOCKED = "https://cdn-icons-png.flaticon.com/512/61/61457.png";

    // 🔥 AUTO CALCULATE STREAK
    const calculateStreak = async () => {
        const today = new Date().toDateString();
        const savedLevel = await AsyncStorage.getItem("streak-level");
        const savedDate = await AsyncStorage.getItem("streak-date");

        let currentLevel = savedLevel ? parseInt(savedLevel) : 1;

        if (!savedDate) {
            await AsyncStorage.setItem("streak-level", "1");
            await AsyncStorage.setItem("streak-date", today);
            setLevel(1);
            return;
        }

        const lastDate = new Date(savedDate);
        const now = new Date(today);

        const diffDays = Math.floor(
            (now - lastDate) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
            // naik streak
            currentLevel = currentLevel + 1;
        } else if (diffDays > 1) {
            // streak putus → kembali level 1
            currentLevel = 1;
        }

        // simpan
        await AsyncStorage.setItem("streak-level", currentLevel.toString());
        await AsyncStorage.setItem("streak-date", today);

        setLevel(currentLevel);
    };

    useEffect(() => {
        calculateStreak();
    }, []);

    const streakLevels = Array.from({ length: TOTAL_LEVELS }).map((_, i) => {
        const lvl = i + 1;
        return {
            level: lvl,
            unlocked: lvl <= level,
            requirement: `Keep a ${lvl}-day streak!`,
        };
    });

    return (
        <Box flex={1} bg="#E7F2FF">
            {/* BLUE HEADER */}
            <Box
                h={260}
                bg="#3BA3FF"
                pb="$6"
                alignItems="center"
                justifyContent="flex-end"
                style={{
                    borderBottomLeftRadius: 32,
                    borderBottomRightRadius: 32,
                }}
            >
                {/* BIG MEDAL ICON */}
                <Image
                    source={{ uri: ICON_BIG }}
                    style={{ width: 160, height: 160, marginBottom: 10 }}
                    resizeMode="contain"
                />

                {/* CURRENT STREAK LEVEL */}
                <Text fontSize="$2xl" color="white" fontWeight="bold">
                    Streak Level {level}
                </Text>

                <Text color="white">
                    You've maintained {level}-day consistency!
                </Text>
            </Box>

            {/* WHITE SECTION */}
            <Box flex={1} mt={-20} bg="white" roundedTop="$3xl" p="$4">
                <Text fontWeight="bold" fontSize="$lg" mb="$4">
                    Your Streak Progress
                </Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                        }}
                    >
                        {streakLevels.map((item, index) => (
                            <View
                                key={index}
                                style={{
                                    width: "30%",
                                    marginBottom: 25,
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    source={{
                                        uri: item.unlocked
                                            ? ICON_SMALL
                                            : ICON_LOCKED,
                                    }}
                                    style={{ width: 70, height: 70, marginBottom: 8 }}
                                    resizeMode="contain"
                                />

                                {/* LEVEL NAME */}
                                <Text
                                    fontWeight="bold"
                                    fontSize="$sm"
                                    textAlign="center"
                                    color={item.unlocked ? "#1E1E1E" : "#A0A0A0"}
                                >
                                    Level {item.level}
                                </Text>

                                <Text
                                    fontSize="$xs"
                                    textAlign="center"
                                    color={item.unlocked ? "#4A4A4A" : "#C0C0C0"}
                                >
                                    {item.unlocked
                                        ? item.level === level
                                            ? "Your current streak level"
                                            : "Unlocked"
                                        : item.requirement}
                                </Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </Box>
        </Box>
    );
}
