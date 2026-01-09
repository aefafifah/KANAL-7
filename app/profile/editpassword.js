import { useState } from "react";
import { Stack, useRouter } from "expo-router";
import {
    Box,
    Text,
    VStack,
    Input,
    InputField,
    Button,
    ButtonText,
} from "@gluestack-ui/themed";
import { auth } from "../../src/config/firebase";
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from "firebase/auth";

export default function ChangePassword() {
    const router = useRouter();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Lengkapi semua field");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Password baru tidak sama");
            return;
        }

        try {
            setLoading(true);

            const user = auth.currentUser;
            if (!user || !user.email) return;

            // 🔐 Re-authentication (WAJIB)
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );

            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);

            alert("Password berhasil diubah");
            router.back();
        } catch (e) {
            console.log(e);
            alert("Password lama salah atau terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen options={{ title: "Change Password" }} />

            <Box flex={1} bg="#F1F5F9" p="$5">
                <VStack space="lg">
                    <Input>
                        <InputField
                            placeholder="Current password"
                            secureTextEntry
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                        />
                    </Input>

                    <Input>
                        <InputField
                            placeholder="New password"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                    </Input>

                    <Input>
                        <InputField
                            placeholder="Confirm new password"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    </Input>

                    <Button onPress={handleChangePassword} isDisabled={loading}>
                        <ButtonText>
                            {loading ? "Saving..." : "Save Password"}
                        </ButtonText>
                    </Button>
                </VStack>
            </Box>
        </>
    );
}
