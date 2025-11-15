import React, { useEffect, useState } from "react";
import {
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "@gluestack-ui/themed";
import { MaterialIcons } from "@expo/vector-icons";


const moods = [
    { label: "Happy", emoji: "😄", color: "#FFD93D" },
    { label: "Calm", emoji: "😊", color: "#6FCF97" },
    { label: "Neutral", emoji: "😐", color: "#BDBDBD" },
    { label: "Sad", emoji: "😢", color: "#56CCF2" },
    { label: "Angry", emoji: "😡", color: "#EB5757" },
];

export default function MoodScreen() {
    const [selectedMood, setSelectedMood] = useState(null);
    const [history, setHistory] = useState([]);
    const [isLocked, setIsLocked] = useState(false); // ⬅ mood lock

    useEffect(() => {
        loadMood();
        loadHistory();
    }, []);

    const loadMood = async () => {
        const saved = await AsyncStorage.getItem("currentMood");
        if (saved) {
            setSelectedMood(JSON.parse(saved));
            setIsLocked(true); // ⬅ kunci mood kalau sudah disimpan
        }
    };

    const loadHistory = async () => {
        const saved = await AsyncStorage.getItem("moodHistory");
        if (saved) setHistory(JSON.parse(saved));
    };

    const saveMood = async () => {
        if (!selectedMood || isLocked) return; // ⬅ tidak bisa set ulang

        await AsyncStorage.setItem("currentMood", JSON.stringify(selectedMood));

        const newEntry = {
            mood: selectedMood,
            time: new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        const newHistory = [newEntry, ...history];
        setHistory(newHistory);

        await AsyncStorage.setItem("moodHistory", JSON.stringify(newHistory));

        setIsLocked(true); // ⬅ kunci setelah set mood
    };

    const handleEdit = () => {
        setIsLocked(false); // ⬅ buka kunci
        setSelectedMood(null); // kosongkan supaya bisa pilih lagi
    };

    const deleteHistoryItem = async (index) => {
        const updated = history.filter((_, i) => i !== index);
        setHistory(updated);
        await AsyncStorage.setItem("moodHistory", JSON.stringify(updated));
    };


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 20, paddingTop: 5, paddingBottom: 80 }}
            >
                {/* Title */}
                <Text style={styles.title}>How do you feel today?</Text>

                {/* Current Mood */}
                <View style={styles.currentMoodCard}>
                    {isLocked && selectedMood ? (
                        <>
                            <Text style={styles.currentEmoji}>{selectedMood.emoji}</Text>
                            <Text style={styles.currentMoodText}>{selectedMood.label}</Text>

                            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                                <Text style={styles.editText}>Edit Mood</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <Text style={styles.noMoodText}>No mood selected yet</Text>
                    )}
                </View>

                {/* Select Mood Section */}
                <Text style={styles.sectionTitle}>Choose Your Mood</Text>

                <View style={styles.moodGrid}>
                    {moods.map((m) => (
                        <TouchableOpacity
                            key={m.label}
                            style={[
                                styles.moodItem,
                                selectedMood?.label === m.label && {
                                    borderColor: m.color,
                                    borderWidth: 3,
                                },
                                isLocked && { opacity: 0.4 }, // ⬅ block pick ketika locked
                            ]}
                            disabled={isLocked}
                            onPress={() => setSelectedMood(m)}
                        >
                            <Text style={styles.emoji}>{m.emoji}</Text>
                            <Text style={styles.moodLabel}>{m.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Set Mood Button */}
                <TouchableOpacity
                    style={[
                        styles.setButton,
                        selectedMood && !isLocked && { backgroundColor: selectedMood.color },
                        (isLocked || !selectedMood) && { backgroundColor: "#999" }, // ⬅ disable
                    ]}
                    disabled={isLocked || !selectedMood} // ⬅ benar-benar disable
                    onPress={saveMood}
                >
                    <Text style={styles.setButtonText}>
                        {isLocked ? "Mood Set" : "Set Mood"}
                    </Text>
                </TouchableOpacity>

                {/* History */}
                <Text style={styles.sectionTitle}>Mood History</Text>

                {/* {history.map((item, index) => (
                    <View key={index} style={styles.historyCard}>
                        <View style={styles.historyLeft}>
                            <Text style={styles.historyEmoji}>{item.mood.emoji}</Text>
                            <Text style={styles.historyLabel}>{item.mood.label}</Text>
                        </View>
                        <Text style={styles.historyTime}>{item.time}</Text>
                    </View>
                ))} */}

                {history.map((item, index) => (
                    <View key={index} style={styles.historyCard}>
                        <View style={styles.historyLeft}>
                            <Text style={styles.historyEmoji}>{item.mood.emoji}</Text>
                            <Text style={styles.historyLabel}>{item.mood.label}</Text>
                        </View>

                        <View style={{ alignItems: "flex-end" }}>
                            <Text style={styles.historyTime}>{item.time}</Text>

                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => deleteHistoryItem(index)}
                            >
                                <MaterialIcons name="delete" size={18} color="#9c0707ff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },

    currentMoodCard: {
        backgroundColor: "#f3f4f6",
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        marginBottom: 30,
    },

    currentEmoji: { fontSize: 60 },
    currentMoodText: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
    noMoodText: { fontSize: 16, color: "#666" },

    editButton: {
        marginTop: 10,
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: "#3b82f6",
        borderRadius: 12,
    },
    editText: { color: "#fff", fontWeight: "bold" },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },

    moodGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    moodItem: {
        width: "48%",
        backgroundColor: "#f5f5f5",
        borderRadius: 16,
        paddingVertical: 20,
        marginBottom: 15,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "transparent",
    },

    emoji: { fontSize: 36 },
    moodLabel: { marginTop: 8, fontWeight: "bold" },

    setButton: {
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        marginVertical: 20,
    },
    setButtonText: { fontSize: 18, fontWeight: "bold", color: "#fff" },

    historyCard: {
        backgroundColor: "#f3f4f6",
        padding: 16,
        borderRadius: 14,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    historyLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
    historyEmoji: { fontSize: 30 },
    historyLabel: { fontSize: 16, fontWeight: "bold" },
    historyTime: { fontSize: 14, color: "#666" },
});