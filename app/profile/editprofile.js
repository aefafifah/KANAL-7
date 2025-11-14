import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Center, Box, Input, InputField, Button, ButtonText, Text } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";

export default function EditProfile() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        AsyncStorage.getItem("user").then((res) => {
            if (res) {
                const u = JSON.parse(res);
                setName(u.name);
                setEmail(u.email);
            }
        });
    }, []);

    const handleSave = async () => {
        if (!name || !email) return alert("Nama dan email wajib diisi!");

        const stored = await AsyncStorage.getItem("user");
        const user = stored ? JSON.parse(stored) : {};

        const updated = { ...user, name, email };

        await AsyncStorage.setItem("user", JSON.stringify(updated));
        alert("Profil berhasil disimpan!");
        router.back();
    };

    return (
        <Center flex={1} px="$6" bg="$gray100">
            <Box w="100%" maxWidth={350} p="$6" bg="$white" rounded="$xl" shadow="$2">

                <Text fontSize="$2xl" mb="$4" fontWeight="bold">
                    Edit Profile
                </Text>

                <Input mb="$3">
                    <InputField placeholder="Nama" value={name} onChangeText={setName} />
                </Input>

                <Input mb="$4">
                    <InputField
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                </Input>

                <Button onPress={handleSave}>
                    <ButtonText>Simpan</ButtonText>
                </Button>

            </Box>
        </Center>
    );
}
