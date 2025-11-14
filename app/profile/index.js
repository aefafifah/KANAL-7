import { Center, Box, Text, Button, ButtonText } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState({ username: "", email: "", password: "" });

    useFocusEffect(
        useCallback(() => {
            AsyncStorage.getItem("user").then((res) => {
                if (res) setUser(JSON.parse(res));
            });
        }, [])
    );

    return (
        <Center flex={1} px="$6" bg="$gray100">
            <Box w="100%" maxWidth={350} p="$6" bg="$white" rounded="$xl">
                <Text fontSize="$2xl" fontWeight="bold" mb="$4">
                    Profil Saya
                </Text>

                <Text fontSize="$lg" mb="$1">Nama:</Text>
                <Text mb="$3">{user.username}</Text>

                <Text fontSize="$lg" mb="$1">Email:</Text>
                <Text mb="$5">{user.email}</Text>

                <Text fontSize="$lg" mb="$1">Password:</Text>
                <Text mb="$5">{user.password}</Text>

                <Button onPress={() => router.push("/profile/editprofile")}>
                    <ButtonText>Edit Profil</ButtonText>
                </Button>
            </Box>
        </Center>
    );
}
