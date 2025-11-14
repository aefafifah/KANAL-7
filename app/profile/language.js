// import { Center, Box, Button, ButtonText, Text } from "@gluestack-ui/themed";
// import { useRouter } from "expo-router";

// export default function Language() {
//     const router = useRouter();

//     return (
//         <Center flex={1} bg="$gray100">
//             <Box p="$6" w="90%" bg="$white" rounded="$xl">
//                 <Text fontSize="$lg" fontWeight="$bold" mb="$4">Pilih Bahasa</Text>

//                 <Button mb="$3"><ButtonText>Bahasa Indonesia</ButtonText></Button>
//                 <Button mb="$3"><ButtonText>English</ButtonText></Button>

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

export default function LanguageScreen() {
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
                <Text fontSize="$2xl" mb="$4" fontWeight="bold">Pilih Bahasa</Text>

                <VStack space="md">
                    {options.map((o) => (
                        <Button key={o} mb="$2" onPress={() => choose(o)}>
                            <ButtonText>{o === "id" ? "Indonesia" : o === "en" ? "English" : "Japanese"}</ButtonText>
                        </Button>
                    ))}
                </VStack>
            </Box>
        </Center>
    );
}
