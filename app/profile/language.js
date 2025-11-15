import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Center, Box, Button, ButtonText, Text, VStack } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";

export default function LanguageScreen({ title = "Pilih Bahasa" }) {
    const router = useRouter();
    const [lang, setLang] = useState(null);
    const options = ["id", "en", "jp"];

    useEffect(() => {
        AsyncStorage.getItem("app_lang").then((r) => setLang(r || "id"));
    }, []);

    const choose = async (l) => {
        await AsyncStorage.setItem("app_lang", l);
        setLang(l);
        alert("Bahasa disimpan: " + l);
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
                            <ButtonText>
                                {o === "id" ? "Indonesia" : o === "en" ? "English" : "Japanese"}
                            </ButtonText>
                        </Button>
                    ))}
                </VStack>

            </Box>
        </Center>
    );
}