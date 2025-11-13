// import { Center, Heading } from "@gluestack-ui/themed";
// import { Header } from "../../components";

// const Profile = () => {
//   return (
//     <>
//       <Center flex={1}>
//         <Heading>Halaman Profil</Heading>
//       </Center>
//     </>
//   );
// };

// export default Profile;

import { useRouter } from "expo-router";
import { Center, Heading, Box, Button, ButtonText, Text } from "@gluestack-ui/themed";

const Profile = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Nanti bisa ditambah logika hapus token dsb
    router.replace("/login"); // kembali ke halaman login
  };

  return (
    <Center flex={1} bg="$gray50" px="$6">
      <Box
        bg="$white"
        rounded="$xl"
        shadow="$2"
        p="$6"
        w="100%"
        maxWidth={350}
        alignItems="center"
      >
        <Heading mb="$2">Profil Pengguna</Heading>
        <Text color="$gray600" mb="$6">
          Kelola akun Anda di sini
        </Text>

        {/* Data contoh profil */}
        <Box w="100%" mb="$4">
          <Text fontWeight="$bold" color="$gray700">
            Nama:
          </Text>
          <Text mb="$3">Mahasiswa Kanal-7</Text>

          <Text fontWeight="$bold" color="$gray700">
            Email:
          </Text>
          <Text mb="$6">user@kanal7.com</Text>
        </Box>

        {/* Tombol Logout */}
        <Button
          bg="$red600"
          onPress={handleLogout}
          w="100%"
          rounded="$lg"
        >
          <ButtonText color="$white" fontWeight="$bold">
            Logout
          </ButtonText>
        </Button>
      </Box>
    </Center>
  );
};

export default Profile;