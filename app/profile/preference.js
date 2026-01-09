import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    Box,
    Text,
    VStack,
    HStack,
    Pressable,
    Switch,
} from "@gluestack-ui/themed";
import { ChevronRight, Sun, Moon, Bell } from "lucide-react-native";
import { getSleepTime } from "../sleepStore";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";


const PRIMARY = "#2563EB";
const SOFT_BG = "#EEF2FF";

export default function PreferenceScreen() {
    const router = useRouter();

    const [morningTime, setMorningTime] = useState("--:--");
    const [eveningTime, setEveningTime] = useState("--:--");

    const [dailyReminder, setDailyReminder] = useState(false);
    const [reminderTime, setReminderTime] = useState("--:--");

    useFocusEffect(
        useCallback(() => {
            load();
        }, [])
    );


    const load = async () => {
        const sleepData = await getSleepTime();
        if (sleepData) {
            setMorningTime(sleepData.wakeTime);
            setEveningTime(sleepData.sleepTime);
        }

        const r = await AsyncStorage.getItem("daily-reminder");
        setDailyReminder(r === "true");

        const rt = await AsyncStorage.getItem("reminder-time");
        if (rt) setReminderTime(rt);
    };

    return (
        <>
            <Stack.Screen options={{ title: "Preferences" }} />

            <Box flex={1} bg={SOFT_BG} p="$4">
                <VStack space="lg">

                    {/* ===== SLEEP ZONE ===== */}
                    <Box bg="$white" rounded="$2xl" p="$4" shadow="$1">
                        <Text fontSize="$lg" fontWeight="$bold" mb="$3" color="#1E293B">
                            Sleep Zone
                        </Text>

                        <PreferenceRow
                            icon={Sun}
                            label="Morning"
                            value={morningTime}
                        />

                        <Divider />

                        <PreferenceRow
                            icon={Moon}
                            label="Evening"
                            value={eveningTime}
                        />
                    </Box>

                    {/* ===== REMINDER ===== */}
                    <Box bg="$white" rounded="$2xl" p="$4" shadow="$1">
                        <Text fontSize="$lg" fontWeight="$bold" mb="$3" color="#1E293B">
                            Reminder
                        </Text>

                        <HStack justifyContent="space-between" alignItems="center" mb="$3">
                            <HStack space="md" alignItems="center">
                                <Box bg="#DBEAFE" p="$2" rounded="$full">
                                    <Bell size={18} color={PRIMARY} />
                                </Box>
                                <Text>Daily Reminder</Text>
                            </HStack>

                            <Switch
                                value={dailyReminder}
                                onValueChange={async (v) => {
                                    setDailyReminder(v);
                                    await AsyncStorage.setItem(
                                        "daily-reminder",
                                        v.toString()
                                    );
                                }}
                            />
                        </HStack>

                        <Divider />

                        <PreferenceRow
                            label="Reminder Time"
                            value={reminderTime}
                            onPress={() => router.push("/profile/reminder-time")}
                            disabled={!dailyReminder}
                        />
                    </Box>
                </VStack>
            </Box>
        </>
    );
}

/* ===================== */

function PreferenceRow({
    icon: Icon,
    label,
    value,
    onPress,
    disabled,
}) {
    return (
        <Pressable onPress={onPress} disabled={!onPress || disabled}>
            <HStack
                py="$3"
                justifyContent="space-between"
                alignItems="center"
                opacity={disabled ? 0.4 : 1}
            >
                <HStack space="md" alignItems="center">
                    {Icon && (
                        <Box bg="#DBEAFE" p="$2" rounded="$full">
                            <Icon size={18} color={PRIMARY} />
                        </Box>
                    )}
                    <Text color="#1E293B">{label}</Text>
                </HStack>

                <HStack space="xs" alignItems="center">
                    <Text color="#64748B">{value}</Text>
                    {onPress && <ChevronRight size={16} color="#9CA3AF" />}
                </HStack>
            </HStack>
        </Pressable>
    );
}

function Divider() {
    return <Box h={1} bg="#E5E7EB" my="$2" />;
}
