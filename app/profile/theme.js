// import { Center, Box, Button, ButtonText, Text } from "@gluestack-ui/themed";
// import { useRouter } from "expo-router";

// export default function ThemeScreen() {
//     const router = useRouter();

//     return (
//         <Center flex={1} bg="$gray100">
//             <Box p="$6" w="90%" bg="$white" rounded="$xl">
//                 <Text fontSize="$lg" fontWeight="$bold" mb="$4">Mode Tampilan</Text>

//                 <Button mb="$3"><ButtonText>Light Mode</ButtonText></Button>
//                 <Button mb="$3"><ButtonText>Dark Mode</ButtonText></Button>

//                 <Button variant="outline" onPress={() => router.back()}>
//                     <ButtonText>Kembali</ButtonText>
//                 </Button>
//             </Box>
//         </Center>
//     );
// }
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Center, Box, Button, ButtonText, Text, VStack } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";

export default function ThemeScreen() {
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
                <Text fontSize="$2xl" mb="$4" fontWeight="bold">Pilih Tema</Text>

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
