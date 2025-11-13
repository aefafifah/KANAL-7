// import { Center, Heading } from "@gluestack-ui/themed";

// const Login = () => (
//   <Center flex={1}>
//     <Heading>Halaman Login</Heading>
//   </Center>
// );

// export default Login;


// import { useRouter } from "expo-router";
// import { Box, Input, InputField, Text, Button, ButtonText, Center } from "@gluestack-ui/themed";
// import { useState } from "react";

// export default function LoginScreen() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = () => {
//     if (email === "" || password === "") {
//       alert("Mohon isi semua field!");
//       return;
//     }
//     // nanti bisa disambungkan ke autentikasi
//     router.replace("/(tabs)/home"); // masuk ke halaman utama setelah login
//   };

//   return (
//     <Center flex={1} bg="$gray100" px="$6">
//       <Box w="100%" maxWidth={350} p="$6" bg="$white" rounded="$xl" shadow="$2">
//         <Text fontSize="$2xl" fontWeight="$bold" mb="$4" textAlign="center">
//           Masuk Akun
//         </Text>

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

//         <Button onPress={handleLogin}>
//           <ButtonText>Masuk</ButtonText>
//         </Button>

//         <Button
//           variant="link"
//           mt="$3"
//           onPress={() => router.push("/register")}
//         >
//           <ButtonText color="$blue600">Belum punya akun? Daftar</ButtonText>
//         </Button>
//       </Box>
//     </Center>
//   );
// }

import { useRouter } from "expo-router";
import { Box, Input, InputField, Text, Button, ButtonText, Center } from "@gluestack-ui/themed";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (email === "" || password === "") {
      alert("Mohon isi semua field!");
      return;
    }

    const storedUser = await AsyncStorage.getItem("user");
    if (!storedUser) {
      alert("Belum ada akun terdaftar. Silakan daftar dulu.");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.email === email && user.password === password) {
      router.replace("/(tabs)/home"); // masuk ke halaman utama
    } else {
      alert("Email atau password salah!");
    }
  };

  return (
    <Center flex={1} bg="$gray100" px="$6">
      <Box w="100%" maxWidth={350} p="$6" bg="$white" rounded="$xl" shadow="$2">
        <Text fontSize="$2xl" fontWeight="$bold" mb="$4" textAlign="center">
          Masuk Akun
        </Text>

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

        <Button onPress={handleLogin}>
          <ButtonText>Masuk</ButtonText>
        </Button>

        <Button variant="link" mt="$3" onPress={() => router.push("/register")}>
          <ButtonText color="$blue600">Belum punya akun? Daftar</ButtonText>
        </Button>
      </Box>
    </Center>
  );
}
