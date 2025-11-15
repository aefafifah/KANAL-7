import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Center, Box, Button, ButtonText, Text, VStack } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";

export default function ThemeScreen({ title = "Pilih Tema" }) {
    const router = useRouter();
    const [theme, setTheme] = useState(null);
    const options = ["light", "dark", "system"];

    useEffect(() => {
        AsyncStorage.getItem("app_theme").then((r) => setTheme(r || "system"));
    }, []);

    const choose = async (t) => {
        await AsyncStorage.setItem("app_theme", t);
        setTheme(t);
        alert("Tema disimpan: " + t);
        router.back();
    };

    return (
        <Center flex={1} px="$6" bg="$gray100">
            <Box w="100%" maxWidth={350} p="$6" bg="$white" rounded="$xl" shadow="$2">

                <Text fontSize="$2xl" mb="$4" fontWeight="bold">
                    {title}
                </Text>

                <VStack space="md">
                    {options.map((o) => (
                        <Button key={o} mb="$2" onPress={() => choose(o)}>
                            <ButtonText>{o[0].toUpperCase() + o.slice(1)}</ButtonText>
                        </Button>
                    ))}
                </VStack>

            </Box>
        </Center>
    );
}