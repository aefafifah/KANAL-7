import { FlatList } from "react-native";
import { Box, Button, ButtonIcon, ButtonText } from "@gluestack-ui/themed";
import { AddIcon } from "@gluestack-ui/themed"; 
import CommunityPostCard from "../../components/CommunityPostCard"; 

// Data dummy (tetap sama)
const DUMMY_POSTS = [
  {
    id: '1',
    userName: 'R Clara Angelica Surya',
    avatarUrl: '#',
    timestamp: '2 jam yang lalu',
    postText: 'kemeja untuk outfit ngampus nih',
    postLink: 's.shopee.co.id/AA9HtcEpl5'
  },
  {
    id: '2',
    userName: 'R Clara Angelica Surya',
    avatarUrl: '#',
    timestamp: '2 jam yang lalu',
    postText: 'parfum nya nihh',
    postLink: 's.shopee.co.id/AUm8Ibx36V'
  },
  {
    id: '3',
    userName: 'R Clara Angelica Surya',
    avatarUrl: '#',
    timestamp: '2 jam yang lalu',
    postText: 'nih siapa yang butuh sunscreen',
    postLink: 's.shopee.co.id/2vjqlOCfmo'
  },
  {
    id: '4',
    userName: 'R Clara Angelica Surya',
    avatarUrl: '#',
    timestamp: '2 jam yang lalu',
    postText: 'parfum nya nihh',
    postLink: 's.shopee.co.id/AUm8Ibx36V'
  },
  {
    id: '5',
    userName: 'R Clara Angelica Surya',
    avatarUrl: '#',
    timestamp: '2 jam yang lalu',
    postText: 'nih siapa yang butuh sunscreen',
    postLink: 's.shopee.co.id/2vjqlOCfmo'
  },
];

const CommunityScreen = () => {
  return (
    <Box flex={1} bg="$gray50">
      
      <FlatList
        data={DUMMY_POSTS}
        renderItem={({ item }) => <CommunityPostCard post={item} />}
        keyExtractor={(item) => item.id}
        // Beri ruang di atas agar tidak terlalu mepet header
        contentContainerStyle={{ 
          paddingTop: 12,
          paddingBottom: 100 // Beri ruang di bawah untuk tombol FAB
        }} 
      />

      {/* --- TOMBOL "+ POST" DIPINDAH KE KANAN BAWAH --- */}
      <Button 
        size="md" 
        action="primary" // Merah
        onPress={() => alert('Buka halaman Buat Postingan')}
        rounded="$full"
        position="absolute"
        bottom="$4" // Di atas tab bar
        right="$4"  // Di pojok kanan
        shadow="$3" 
      >
        <ButtonIcon as={AddIcon} mr="$2" />
        <ButtonText>Post</ButtonText>
      </Button>

    </Box>
  );
};

export default CommunityScreen;