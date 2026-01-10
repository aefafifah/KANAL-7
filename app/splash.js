// import { useEffect } from "react";
// import { Image } from "react-native";
// import { Box, Center, Text } from "@gluestack-ui/themed";
// import { useRouter } from "expo-router";

// const PRIMARY = "#3B82F6";

// export default function Splash() {
//     const router = useRouter();

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             router.replace("/login");
//         }, 3000); // 3 detik (ubah ke 30000 kalau mau 30 detik)

//         return () => clearTimeout(timer);
//     }, []);

//     return (
//         <Box flex={1} bg={PRIMARY}>
//             <Center flex={1}>
//                 <Image
//                     source={require("../assets/splash.png")}
//                     style={{ width: 180, height: 180 }}
//                     resizeMode="contain"
//                 />

//                 <Text mt="$6" fontSize="$xl" fontWeight="$bold" color="$white">
//                     Kanal Minum
//                 </Text>
//             </Center>
//         </Box>
//     );
// }

import { useEffect } from "react";
import { Image } from "react-native";
import {
    Box,
    Center,
    Text,
    VStack,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";

const BG = "#EEF2FF";
const PRIMARY = "#3B82F6";

export default function Splash() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace("/login");
        }, 3000); // 3 detik

        return () => clearTimeout(timer);
    }, []);

    return (
        <Box flex={1} bg={BG}>
            <Center flex={1}>
                {/* CARD */}
                <Box
                    bg="$white"
                    px="$10"
                    py="$12"
                    rounded="$3xl"
                    shadow="$2"
                    alignItems="center"
                >
                    {/* LOGO */}
                    <Image
                        source={require("../assets/logo.png")}
                        style={{ width: 140, height: 140 }}
                        resizeMode="contain"
                    />

                    {/* APP NAME */}
                    <Text
                        mt="$6"
                        fontSize="$2xl"
                        fontWeight="$bold"
                        color="#1E293B"
                    >
                        Kanal Minum
                    </Text>

                    {/* TAGLINE */}
                    <Text
                        mt="$1"
                        fontSize="$sm"
                        color="#64748B"
                    >
                        Stay hydrated, stay healthy 💧
                    </Text>
                </Box>
            </Center>
        </Box>
    );
}
