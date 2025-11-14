// import { useRouter } from "expo-router";
// import { Box, Center, Input, InputField, Button, ButtonText, Text } from "@gluestack-ui/themed";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useState } from "react";

// export default function EditPassword() {
//     const router = useRouter();
//     const [newPassword, setNewPassword] = useState("");

//     const updatePassword = async () => {
//         const saved = await AsyncStorage.getItem("user");
//         const user = JSON.parse(saved);

//         await AsyncStorage.setItem("user", JSON.stringify({ ...user, password: newPassword }));

//         alert("Password berhasil diperbarui!");
//         router.back();
//     };

//     return (
//         <Center flex={1} bg="$gray100">
//             <Box w="90%" p="$6" bg="$white" rounded="$xl">
//                 <Text fontSize="$lg" fontWeight="$bold" mb="$4">Ubah Password</Text>

//                 <Input mb="$4"><InputField secureTextEntry value={newPassword} onChangeText={setNewPassword} /></Input>

//                 <Button onPress={updatePassword}><ButtonText>Simpan</ButtonText></Button>
//             </Box>
//         </Center>
//     );
// }

// import { useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Center, Box, Input, InputField, Button, ButtonText, Text } from "@gluestack-ui/themed";
// import { useRouter } from "expo-router";

// export default function EditPassword() {
//     const router = useRouter();
//     const [newPass, setNewPass] = useState("");

//     const handleSave = async () => {
//         if (!newPass) return alert("Masukkan password baru");
//         const stored = await AsyncStorage.getItem("user");
//         const user = stored ? JSON.parse(stored) : {};
//         await AsyncStorage.setItem("user", JSON.stringify({ ...user, password: newPass }));
//         alert("Password diperbarui");
//         router.back();
//     };

//     return (
//         <Center flex={1} px="$6" bg="$gray100">
//             <Box w="100%" maxWidth={350} p="$6" bg="$white" rounded="$xl" shadow="$2">
//                 <Text fontSize="$2xl" mb="$4" fontWeight="bold">Ubah Password</Text>

//                 <Input mb="$4">
//                     <InputField placeholder="Password Baru" secureTextEntry value={newPass} onChangeText={setNewPass} />
//                 </Input>

//                 <Button onPress={handleSave}>
//                     <ButtonText>Simpan</ButtonText>
//                 </Button>
//             </Box>
//         </Center>
//     );
// }

import { useState } from "react";
import { Center, Box, Input, InputField, Button, ButtonText, Text } from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function EditPassword() {
    const router = useRouter();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = async () => {
        const saved = await AsyncStorage.getItem("user");
        if (!saved) return alert("User tidak ditemukan!");

        const user = JSON.parse(saved);

        if (oldPassword !== user.password) {
            return alert("Password lama salah!");
        }

        if (newPassword.length < 6) {
            return alert("Password minimal 6 karakter!");
        }

        if (newPassword !== confirmPassword) {
            return alert("Konfirmasi password tidak cocok!");
        }

        // Update password
        const updatedUser = { ...user, password: newPassword };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

        // Hapus session (logout)
        await AsyncStorage.removeItem("user");

        alert("Password berhasil diubah. Silakan login kembali.");

        // Arahkan kembali ke halaman login
        router.replace("/login");
    };

    return (
        <Center flex={1} px="$6" bg="$gray100">
            <Box w="100%" maxWidth={350} p="$6" bg="$white" rounded="$xl">

                <Text fontSize="$2xl" mb="$4" fontWeight="bold">
                    Ubah Password
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
