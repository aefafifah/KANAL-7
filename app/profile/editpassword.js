import { useState } from "react";
import { Center, Box, Input, InputField, Button, ButtonText, Text } from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function EditPassword({ title = "Ubah Password" }) {
    const router = useRouter();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = async () => {
        const saved = await AsyncStorage.getItem("user");
        if (!saved) return alert("User tidak ditemukan!");

        const user = JSON.parse(saved);

        if (oldPassword !== user.password) return alert("Password lama salah!");
        if (newPassword.length < 6) return alert("Password minimal 6 karakter!");
        if (newPassword !== confirmPassword) return alert("Konfirmasi password tidak cocok!");

        const updatedUser = { ...user, password: newPassword };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        await AsyncStorage.removeItem("user");

        alert("Password berhasil diubah. Silakan login kembali.");
        router.replace("/login");
    };

    return (
        <Center flex={1} px="$6" bg="$gray100">
            <Box w="100%" maxWidth={350} p="$6" bg="$white" rounded="$xl">

                <Text fontSize="$2xl" mb="$4" fontWeight="bold">
                    {title}
                </Text>

                <Text mb="$1">Password Lama</Text>
                <Input mb="$3">
                    <InputField
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        placeholder="Password lama"
                        secureTextEntry
                    />
                </Input>

                <Text mb="$1">Password Baru</Text>
                <Input mb="$3">
                    <InputField
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Password baru"
                        secureTextEntry
                    />
                </Input>

                <Text mb="$1">Konfirmasi Password Baru</Text>
                <Input mb="$4">
                    <InputField
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Ulangi password baru"
                        secureTextEntry
                    />
                </Input>

                <Button onPress={handleChangePassword}>
                    <ButtonText>Simpan</ButtonText>
                </Button>

            </Box>
        </Center>
    );
}