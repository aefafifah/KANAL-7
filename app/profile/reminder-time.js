import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    Box,
    Text,
    VStack,
    HStack,
    Button,
    ButtonText,
    Pressable,
} from "@gluestack-ui/themed";
import { Clock } from "lucide-react-native";

const PRIMARY = "#2563EB";
const SOFT_BG = "#EEF2FF";

export default function ReminderTimeScreen() {
    const router = useRouter();

    const [time, setTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const saved = await AsyncStorage.getItem("reminder-time");
        if (saved && saved !== "--:--") {
            const [h, m] = saved.split(":").map(Number);
            const d = new Date();
            d.setHours(h);
            d.setMinutes(m);
            setTime(d);
        }
    };

    const onChange = (_, selectedDate) => {
        if (selectedDate) {
            setShowPicker(false);
            setTime(selectedDate);
        }
    };

    const saveTime = async () => {
        const h = String(time.getHours()).padStart(2, "0");
        const m = String(time.getMinutes()).padStart(2, "0");
        const formatted = `${h}:${m}`;

        await AsyncStorage.setItem("reminder-time", formatted);
        router.back();
    };

    return (
        <>
            <Stack.Screen options={{ title: "Reminder Time" }} />

            <Box flex={1} bg={SOFT_BG} p="$4">
                <VStack space="lg">

                    {/* ===== CARD ===== */}
                    <Box bg="$white" rounded="$2xl" p="$6" shadow="$1">
                        <VStack space="md" alignItems="center">
                            <Box bg="#DBEAFE" p="$4" rounded="$full">
                                <Clock size={28} color={PRIMARY} />
                            </Box>

                            <Text fontSize="$xl" fontWeight="$bold">
                                Set Reminder Time
                            </Text>

                            <Text color="#64748B" textAlign="center">
                                Pilih jam untuk pengingat harian kamu
                            </Text>

                            {/* DISPLAY TIME */}
                            <Pressable onPress={() => setShowPicker(true)}>
                                <Box
                                    mt="$4"
                                    px="$6"
                                    py="$3"
                                    bg="#EEF2FF"
                                    rounded="$xl"
                                >
                                    <Text fontSize="$3xl" fontWeight="$bold" color={PRIMARY}>
                                        {String(time.getHours()).padStart(2, "0")}:
                                        {String(time.getMinutes()).padStart(2, "0")}
                                    </Text>
                                </Box>
                            </Pressable>

                            {/* PICKER */}
                            {showPicker && (
                                <DateTimePicker
                                    value={time}
                                    mode="time"
                                    display="spinner"
                                    onChange={onChange}
                                />
                            )}
                        </VStack>
                    </Box>

                    {/* ===== SAVE ===== */}
                    <Button bg={PRIMARY} onPress={saveTime}>
                        <ButtonText color="$white">Save Reminder</ButtonText>
                    </Button>
                </VStack>
            </Box>
        </>
    );
}
