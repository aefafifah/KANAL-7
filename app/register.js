// import { Center, Heading } from "@gluestack-ui/themed";

// const Register = () => (
//   <Center flex={1}>
//     <Heading>Halaman Registrasi</Heading>
//   </Center>
// );

// export default Register;


// import { useRouter } from "expo-router";
// import { Box, Input, InputField, Text, Button, ButtonText, Center } from "@gluestack-ui/themed";
// import { useState } from "react";

// export default function RegisterScreen() {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleRegister = () => {
//     if (!name || !email || !password) {
//       alert("Mohon isi semua field!");
//       return;
//     }
//     alert("Registrasi berhasil!");
//     router.replace("/login"); // kembali ke login setelah daftar
//   };

//   return (
//     <Center flex={1} bg="$gray100" px="$6">
//       <Box w="100%" maxWidth={350} p="$6" bg="$white" rounded="$xl" shadow="$2">
//         <Text fontSize="$2xl" fontWeight="$bold" mb="$4" textAlign="center">
//           Daftar Akun
//         </Text>

//         <Input variant="outline" mb="$3">
//           <InputField
//             placeholder="Nama Lengkap"
//             value={name}
//             onChangeText={setName}
//           />
//         </Input>

//         <Input variant="outline" mb="$3">
//           <InputField
//             placeholder="Email"
//             value={email}
//             onChangeText={setEmail}
//             autoCapitalize="none"
//           />
//         </Input>

//         <Input variant="outline" mb="$4">
//           <InputField
//             placeholder="Password"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//           />
//         </Input>

//         <Button onPress={handleRegister}>
//           <ButtonText>Daftar</ButtonText>
//         </Button>

//         <Button
//           variant="link"
//           mt="$3"
//           onPress={() => router.push("/login")}
//         >
//           <ButtonText color="$blue600">Sudah punya akun? Masuk</ButtonText>
//         </Button>
//       </Box>
//     </Center>
//   );
// }


import { useRouter } from "expo-router";
import { Box, Input, InputField, Text, Button, ButtonText, Center } from "@gluestack-ui/themed";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Mohon isi semua field!");
      return;
    }

    try {
      // cek apakah sudah ada user sebelumnya
      const existingUser = await AsyncStorage.getItem("user");
      if (existingUser) {
        const parsed = JSON.parse(existingUser);
        if (parsed.email === email) {
          alert("Email ini sudah terdaftar!");
          return;
        }
      }

      // simpan user baru
      const newUser = { name, email, password };
      await AsyncStorage.setItem("user", JSON.stringify(newUser));

      alert("Registrasi berhasil!");
      router.replace("/login"); // kembali ke login
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan data!");
    }
  };

  return (
    <Center flex={1} bg="$gray100" px="$6">
      <Box w="100%" maxWidth={350} p="$6" bg="$white" rounded="$xl" shadow="$2">
        <Text fontSize="$2xl" fontWeight="$bold" mb="$4" textAlign="center">
          Daftar Akun
        </Text>

        <Input variant="outline" mb="$3">
          <InputField
            placeholder="Nama Lengkap"
            value={name}
            onChangeText={setName}
          />
        </Input>

        <Input variant="outline" mb="$3">
          <InputField
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </Input>

        <Input variant="outline" mb="$4">
          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </Input>

        <Button onPress={handleRegister}>
          <ButtonText>Daftar</ButtonText>
        </Button>

        <Button variant="link" mt="$3" onPress={() => router.push("/login")}>
          <ButtonText color="$blue600">Sudah punya akun? Masuk</ButtonText>
        </Button>
      </Box>
    </Center>
  );
}
