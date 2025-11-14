// // // import { useState, useEffect } from "react";
// // // import { View, TouchableOpacity, ImageBackground } from "react-native";
// // // import { Box, Text, Button, ButtonText, Center } from "@gluestack-ui/themed";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import dayjs from "dayjs";

// // // const moods = [
// // //     { name: "Happy", emoji: "😃" },
// // //     { name: "Surprised", emoji: "😲" },
// // //     { name: "Fear", emoji: "😨" },
// // //     { name: "Disgust", emoji: "🤢" },
// // //     { name: "Sad", emoji: "😢" },
// // //     { name: "Angry", emoji: "😡" },
// // // ];

// // // export default function MoodScreen() {
// // //     const [selectedMood, setSelectedMood] = useState(null);
// // //     const [entries, setEntries] = useState([]);
// // //     const [todayMood, setTodayMood] = useState(null);

// // //     // ------------------------------------------
// // //     // LOAD DATA
// // //     // ------------------------------------------
// // //     useEffect(() => {
// // //         (async () => {
// // //             const saved = await AsyncStorage.getItem("moodEntries");
// // //             const parsed = saved ? JSON.parse(saved) : [];
// // //             setEntries(parsed);

// // //             const today = dayjs().format("YYYY-MM-DD");
// // //             const todayEntry = parsed.find((e) => e.date === today);

// // //             if (todayEntry) {
// // //                 setTodayMood(todayEntry);
// // //             }
// // //         })();
// // //     }, []);

// // //     // ------------------------------------------
// // //     // SAVE MOOD
// // //     // ------------------------------------------
// // //     const saveMood = async () => {
// // //         if (!selectedMood) return alert("Pilih mood dulu!");

// // //         const now = dayjs();
// // //         const today = now.format("YYYY-MM-DD");
// // //         const time = now.format("HH:mm");

// // //         const newEntry = {
// // //             date: today,
// // //             time,
// // //             mood: selectedMood.name,
// // //             emoji: selectedMood.emoji,
// // //         };

// // //         // Hapus entry hari ini jika sudah ada → agar bisa edit
// // //         const filtered = entries.filter((e) => e.date !== today);

// // //         const updated = [...filtered, newEntry];

// // //         await AsyncStorage.setItem("moodEntries", JSON.stringify(updated));
// // //         setEntries(updated);
// // //         setTodayMood(newEntry);
// // //         setSelectedMood(null);
// // //     };

// // //     // ------------------------------------------
// // //     // UI MAIN
// // //     // ------------------------------------------
// // //     return (
// // //         <Box flex={1} bg="$gray900">

// // //             {/* BACKGROUND (gambarnya samakan sesuai referensi mu nanti) */}
// // //             <ImageBackground
// // //                 // source={require("../../assets/nightbg.png")}
// // //                 style={{ flex: 1, paddingHorizontal: 20, paddingTop: 60 }}
// // //                 resizeMode="cover"
// // //             >
// // //                 <Text fontSize="$2xl" fontWeight="bold" color="$white">
// // //                     How are you feeling today?
// // //                 </Text>
// // //                 <Text color="$gray300" mb="$6">
// // //                     {dayjs().format("MMMM D, YYYY")}
// // //                 </Text>

// // //                 {/* EMOJI BESAR */}
// // //                 <Center mb="$6">
// // //                     <Text fontSize="$7xl">
// // //                         {selectedMood?.emoji || todayMood?.emoji || "🙂"}
// // //                     </Text>
// // //                 </Center>

// // //                 {/* CARD PUTIH BESAR */}
// // //                 <View
// // //                     style={{
// // //                         flex: 1,
// // //                         backgroundColor: "white",
// // //                         borderTopLeftRadius: 40,
// // //                         borderTopRightRadius: 40,
// // //                         padding: 24,
// // //                     }}
// // //                 >
// // //                     {/* Jika sudah memilih untuk hari ini */}
// // //                     {todayMood && !selectedMood && (
// // //                         <View style={{ marginBottom: 20 }}>
// // //                             <Text fontSize="$lg" fontWeight="bold" mb="$2">
// // //                                 Your mood today
// // //                             </Text>
// // //                             <Text fontSize="$xl">
// // //                                 {todayMood.emoji} {todayMood.mood} at {todayMood.time}
// // //                             </Text>

// // //                             <Button
// // //                                 mt="$4"
// // //                                 bg="#f97316"
// // //                                 onPress={() => setSelectedMood({ name: todayMood.mood, emoji: todayMood.emoji })}
// // //                             >
// // //                                 <ButtonText>Edit Mood</ButtonText>
// // //                             </Button>
// // //                         </View>
// // //                     )}

// // //                     {/* Grid tombol mood */}
// // //                     <Text fontWeight="bold" fontSize="$lg" mb="$4">
// // //                         Select your mood
// // //                     </Text>

// // //                     <View
// // //                         style={{
// // //                             flexDirection: "row",
// // //                             flexWrap: "wrap",
// // //                             justifyContent: "space-between",
// // //                         }}
// // //                     >
// // //                         {moods.map((m) => (
// // //                             <TouchableOpacity
// // //                                 key={m.name}
// // //                                 style={{
// // //                                     width: "48%",
// // //                                     padding: 14,
// // //                                     marginBottom: 14,
// // //                                     borderRadius: 14,
// // //                                     alignItems: "center",
// // //                                     borderWidth: selectedMood?.name === m.name ? 2 : 1,
// // //                                     borderColor: selectedMood?.name === m.name ? "#f97316" : "#d1d5db",
// // //                                     backgroundColor: selectedMood?.name === m.name ? "#FFE5D0" : "#fff",
// // //                                 }}
// // //                                 onPress={() => setSelectedMood(m)}
// // //                             >
// // //                                 <Text fontSize="$3xl" mb="$1">
// // //                                     {m.emoji}
// // //                                 </Text>
// // //                                 <Text>{m.name}</Text>
// // //                             </TouchableOpacity>
// // //                         ))}
// // //                     </View>

// // //                     {/* Set Mood Button */}
// // //                     <Button
// // //                         size="lg"
// // //                         bg="#1f1f1f"
// // //                         mt="$4"
// // //                         onPress={saveMood}
// // //                     >
// // //                         <ButtonText color="white">Set Mood</ButtonText>
// // //                     </Button>

// // //                     {/* Riwayat Mood */}
// // //                     <Text fontWeight="bold" mt="$6" mb="$2" fontSize="$lg">
// // //                         Mood History
// // //                     </Text>

// // //                     {entries
// // //                         .sort((a, b) => (a.date < b.date ? 1 : -1))
// // //                         .slice(0, 5)
// // //                         .map((e) => (
// // //                             <Text key={e.date} color="$gray700">
// // //                                 {e.date} • {e.time} — {e.emoji} {e.mood}
// // //                             </Text>
// // //                         ))}
// // //                 </View>
// // //             </ImageBackground>
// // //         </Box>
// // //     );
// // // }

// // import React, { useEffect, useState } from "react";
// // import {
// //     View,
// //     ScrollView,
// //     TouchableOpacity,
// //     StyleSheet,
// // } from "react-native";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { Text } from "@gluestack-ui/themed";

// // const moods = [
// //     { label: "Happy", emoji: "😄", color: "#FFD93D" },
// //     { label: "Calm", emoji: "😊", color: "#6FCF97" },
// //     { label: "Neutral", emoji: "😐", color: "#BDBDBD" },
// //     { label: "Sad", emoji: "😢", color: "#56CCF2" },
// //     { label: "Angry", emoji: "😡", color: "#EB5757" },
// // ];

// // export default function MoodScreen() {
// //     const [selectedMood, setSelectedMood] = useState(null);
// //     const [history, setHistory] = useState([]);

// //     useEffect(() => {
// //         loadMood();
// //         loadHistory();
// //     }, []);

// //     const loadMood = async () => {
// //         const saved = await AsyncStorage.getItem("currentMood");
// //         if (saved) setSelectedMood(JSON.parse(saved));
// //     };

// //     const loadHistory = async () => {
// //         const saved = await AsyncStorage.getItem("moodHistory");
// //         if (saved) setHistory(JSON.parse(saved));
// //     };

// //     const saveMood = async () => {
// //         if (!selectedMood) return;

// //         await AsyncStorage.setItem("currentMood", JSON.stringify(selectedMood));

// //         const newEntry = {
// //             mood: selectedMood,
// //             time: new Date().toLocaleTimeString("id-ID", {
// //                 hour: "2-digit",
// //                 minute: "2-digit",
// //             }),
// //         };

// //         const newHistory = [newEntry, ...history];
// //         setHistory(newHistory);
// //         await AsyncStorage.setItem("moodHistory", JSON.stringify(newHistory));
// //     };

// //     return (
// //         <View style={styles.container}>
// //             <ScrollView
// //                 showsVerticalScrollIndicator={false}
// //                 contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
// //             >
// //                 {/* Title */}
// //                 <Text style={styles.title}>How do you feel today?</Text>

// //                 {/* Current Mood */}
// //                 <View style={styles.currentMoodCard}>
// //                     {selectedMood ? (
// //                         <>
// //                             <Text style={styles.currentEmoji}>{selectedMood.emoji}</Text>
// //                             <Text style={styles.currentMoodText}>{selectedMood.label}</Text>

// //                             <TouchableOpacity
// //                                 style={styles.editButton}
// //                                 onPress={() => setSelectedMood(null)}
// //                             >
// //                                 <Text style={styles.editText}>Edit Mood</Text>
// //                             </TouchableOpacity>
// //                         </>
// //                     ) : (
// //                         <Text style={styles.noMoodText}>No mood selected yet</Text>
// //                     )}
// //                 </View>

// //                 {/* Select Mood Section */}
// //                 <Text style={styles.sectionTitle}>Choose Your Mood</Text>

// //                 <View style={styles.moodGrid}>
// //                     {moods.map((m) => (
// //                         <TouchableOpacity
// //                             key={m.label}
// //                             style={[
// //                                 styles.moodItem,
// //                                 selectedMood?.label === m.label && {
// //                                     borderColor: m.color,
// //                                     borderWidth: 3,
// //                                 },
// //                             ]}
// //                             onPress={() => setSelectedMood(m)}
// //                         >
// //                             <Text style={styles.emoji}>{m.emoji}</Text>
// //                             <Text style={styles.moodLabel}>{m.label}</Text>
// //                         </TouchableOpacity>
// //                     ))}
// //                 </View>

// //                 {/* Set Mood Button */}
// //                 <TouchableOpacity
// //                     style={[
// //                         styles.setButton,
// //                         selectedMood && { backgroundColor: selectedMood.color },
// //                     ]}
// //                     onPress={saveMood}
// //                 >
// //                     <Text style={styles.setButtonText}>Set Mood</Text>
// //                 </TouchableOpacity>

// //                 {/* History */}
// //                 <Text style={styles.sectionTitle}>Mood History</Text>

// //                 {history.map((item, index) => (
// //                     <View key={index} style={styles.historyCard}>
// //                         <View style={styles.historyLeft}>
// //                             <Text style={styles.historyEmoji}>{item.mood.emoji}</Text>
// //                             <Text style={styles.historyLabel}>{item.mood.label}</Text>
// //                         </View>
// //                         <Text style={styles.historyTime}>{item.time}</Text>
// //                     </View>
// //                 ))}
// //             </ScrollView>
// //         </View>
// //     );
// // }

// // // ===================== STYLE =====================

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: "#F9FAFB",
// //     },

// //     title: {
// //         fontSize: 22,
// //         fontWeight: "700",
// //         marginBottom: 15,
// //     },

// //     currentMoodCard: {
// //         backgroundColor: "white",
// //         padding: 25,
// //         borderRadius: 20,
// //         alignItems: "center",
// //         marginBottom: 20,
// //         shadowColor: "#000",
// //         shadowOpacity: 0.08,
// //         shadowRadius: 10,
// //     },

// //     currentEmoji: {
// //         fontSize: 50,
// //     },

// //     currentMoodText: {
// //         fontSize: 20,
// //         fontWeight: "700",
// //         marginTop: 6,
// //     },

// //     editButton: {
// //         marginTop: 12,
// //         backgroundColor: "#E5E7EB",
// //         paddingVertical: 8,
// //         paddingHorizontal: 18,
// //         borderRadius: 10,
// //     },

// //     editText: {
// //         fontWeight: "600",
// //         color: "#333",
// //     },

// //     noMoodText: {
// //         fontSize: 16,
// //         color: "#777",
// //     },

// //     sectionTitle: {
// //         fontSize: 18,
// //         fontWeight: "700",
// //         marginBottom: 10,
// //         marginTop: 10,
// //     },

// //     moodGrid: {
// //         flexDirection: "row",
// //         flexWrap: "wrap",
// //         justifyContent: "space-between",
// //     },

// //     moodItem: {
// //         backgroundColor: "white",
// //         width: "30%",
// //         paddingVertical: 20,
// //         borderRadius: 20,
// //         alignItems: "center",
// //         marginBottom: 15,
// //         shadowColor: "#000",
// //         shadowOpacity: 0.06,
// //         shadowRadius: 6,
// //     },

// //     emoji: {
// //         fontSize: 35,
// //     },

// //     moodLabel: {
// //         marginTop: 8,
// //         fontWeight: "600",
// //     },

// //     setButton: {
// //         marginTop: 10,
// //         paddingVertical: 15,
// //         borderRadius: 15,
// //         alignItems: "center",
// //         backgroundColor: "#9CA3AF",
// //     },

// //     setButtonText: {
// //         color: "white",
// //         fontWeight: "700",
// //         fontSize: 16,
// //     },

// //     historyCard: {
// //         backgroundColor: "white",
// //         padding: 15,
// //         borderRadius: 15,
// //         marginBottom: 10,
// //         flexDirection: "row",
// //         justifyContent: "space-between",
// //         alignItems: "center",
// //         shadowColor: "#000",
// //         shadowOpacity: 0.05,
// //         shadowRadius: 6,
// //     },

// //     historyLeft: {
// //         flexDirection: "row",
// //         alignItems: "center",
// //     },

// //     historyEmoji: {
// //         fontSize: 30,
// //         marginRight: 10,
// //     },

// //     historyLabel: {
// //         fontSize: 16,
// //         fontWeight: "600",
// //     },

// //     historyTime: {
// //         fontSize: 14,
// //         color: "#555",
// //     },
// // });

// import React, { useEffect, useState } from "react";
// import {
//     View,
//     ScrollView,
//     TouchableOpacity,
//     StyleSheet,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Text } from "@gluestack-ui/themed";

// const moods = [
//     { label: "Happy", emoji: "😄", color: "#FFD93D" },
//     { label: "Calm", emoji: "😊", color: "#6FCF97" },
//     { label: "Neutral", emoji: "😐", color: "#BDBDBD" },
//     { label: "Sad", emoji: "😢", color: "#56CCF2" },
//     { label: "Angry", emoji: "😡", color: "#EB5757" },
//     { label: "Fear", emoji: "", color: "#EB5757" },
// ];

// export default function MoodScreen() {
//     const [selectedMood, setSelectedMood] = useState(null);
//     const [history, setHistory] = useState([]);
//     const [isLocked, setIsLocked] = useState(false); // ⬅ mood lock

//     useEffect(() => {
//         loadMood();
//         loadHistory();
//     }, []);

//     const loadMood = async () => {
//         const saved = await AsyncStorage.getItem("currentMood");
//         if (saved) {
//             setSelectedMood(JSON.parse(saved));
//             setIsLocked(true); // ⬅ kunci mood kalau sudah disimpan
//         }
//     };

//     const loadHistory = async () => {
//         const saved = await AsyncStorage.getItem("moodHistory");
//         if (saved) setHistory(JSON.parse(saved));
//     };

//     const saveMood = async () => {
//         if (!selectedMood || isLocked) return; // ⬅ tidak bisa set ulang

//         await AsyncStorage.setItem("currentMood", JSON.stringify(selectedMood));

//         const newEntry = {
//             mood: selectedMood,
//             time: new Date().toLocaleTimeString("id-ID", {
//                 hour: "2-digit",
//                 minute: "2-digit",
//             }),
//         };

//         const newHistory = [newEntry, ...history];
//         setHistory(newHistory);

//         await AsyncStorage.setItem("moodHistory", JSON.stringify(newHistory));

//         setIsLocked(true); // ⬅ kunci setelah set mood
//     };

//     const handleEdit = () => {
//         setIsLocked(false); // ⬅ buka kunci
//         setSelectedMood(null); // kosongkan supaya bisa pilih lagi
//     };

//     return (
//         <View style={styles.container}>
//             <ScrollView
//                 showsVerticalScrollIndicator={false}
//                 contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
//             >
//                 {/* Title */}
//                 <Text style={styles.title}>How do you feel today?</Text>

//                 {/* Current Mood */}
//                 <View style={styles.currentMoodCard}>
//                     {isLocked && selectedMood ? (
//                         <>
//                             <Text style={styles.currentEmoji}>{selectedMood.emoji}</Text>
//                             <Text style={styles.currentMoodText}>{selectedMood.label}</Text>

//                             <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
//                                 <Text style={styles.editText}>Edit Mood</Text>
//                             </TouchableOpacity>
//                         </>
//                     ) : (
//                         <Text style={styles.noMoodText}>No mood selected yet</Text>
//                     )}
//                 </View>

//                 {/* Select Mood Section */}
//                 <Text style={styles.sectionTitle}>Choose Your Mood</Text>

//                 <View style={styles.moodGrid}>
//                     {moods.map((m) => (
//                         <TouchableOpacity
//                             key={m.label}
//                             style={[
//                                 styles.moodItem,
//                                 selectedMood?.label === m.label && {
//                                     borderColor: m.color,
//                                     borderWidth: 3,
//                                 },
//                                 isLocked && { opacity: 0.4 }, // ⬅ block pick ketika locked
//                             ]}
//                             disabled={isLocked}
//                             onPress={() => setSelectedMood(m)}
//                         >
//                             <Text style={styles.emoji}>{m.emoji}</Text>
//                             <Text style={styles.moodLabel}>{m.label}</Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 {/* Set Mood Button */}
//                 <TouchableOpacity
//                     style={[
//                         styles.setButton,
//                         selectedMood && !isLocked && { backgroundColor: selectedMood.color },
//                         (isLocked || !selectedMood) && { backgroundColor: "#999" }, // ⬅ disable
//                     ]}
//                     disabled={isLocked || !selectedMood} // ⬅ benar-benar disable
//                     onPress={saveMood}
//                 >
//                     <Text style={styles.setButtonText}>
//                         {isLocked ? "Mood Set" : "Set Mood"}
//                     </Text>
//                 </TouchableOpacity>

//                 {/* History */}
//                 <Text style={styles.sectionTitle}>Mood History</Text>

//                 {history.map((item, index) => (
//                     <View key={index} style={styles.historyCard}>
//                         <View style={styles.historyLeft}>
//                             <Text style={styles.historyEmoji}>{item.mood.emoji}</Text>
//                             <Text style={styles.historyLabel}>{item.mood.label}</Text>
//                         </View>
//                         <Text style={styles.historyTime}>{item.time}</Text>
//                     </View>
//                 ))}
//             </ScrollView>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#fff" },

//     title: {
//         fontSize: 24,
//         fontWeight: "bold",
//         marginBottom: 20,
//     },

//     currentMoodCard: {
//         backgroundColor: "#f3f4f6",
//         borderRadius: 16,
//         padding: 20,
//         alignItems: "center",
//         marginBottom: 30,
//     },

//     currentEmoji: { fontSize: 60 },
//     currentMoodText: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
//     noMoodText: { fontSize: 16, color: "#666" },

//     editButton: {
//         marginTop: 10,
//         paddingHorizontal: 14,
//         paddingVertical: 8,
//         backgroundColor: "#3b82f6",
//         borderRadius: 12,
//     },
//     editText: { color: "#fff", fontWeight: "bold" },

//     sectionTitle: {
//         fontSize: 18,
//         fontWeight: "bold",
//         marginBottom: 10,
//     },

//     moodGrid: {
//         flexDirection: "row",
//         flexWrap: "wrap",
//         justifyContent: "space-between",
//     },

//     moodItem: {
//         width: "48%",
//         backgroundColor: "#f5f5f5",
//         borderRadius: 16,
//         paddingVertical: 20,
//         marginBottom: 15,
//         alignItems: "center",
//         borderWidth: 2,
//         borderColor: "transparent",
//     },

//     emoji: { fontSize: 36 },
//     moodLabel: { marginTop: 8, fontWeight: "bold" },

//     setButton: {
//         padding: 16,
//         borderRadius: 16,
//         alignItems: "center",
//         marginVertical: 20,
//     },
//     setButtonText: { fontSize: 18, fontWeight: "bold", color: "#fff" },

//     historyCard: {
//         backgroundColor: "#f3f4f6",
//         padding: 16,
//         borderRadius: 14,
//         marginBottom: 10,
//         flexDirection: "row",
//         justifyContent: "space-between",
//     },
//     historyLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
//     historyEmoji: { fontSize: 30 },
//     historyLabel: { fontSize: 16, fontWeight: "bold" },
//     historyTime: { fontSize: 14, color: "#666" },
// });

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