import { Pressable, Linking } from 'react-native';
import { Box, Image, Text, VStack, Heading } from '@gluestack-ui/themed';

// Komponen ini menerima 'post' (data berita) dan 'size' (large/small)
const NewsCard = ({ post, size = 'large' }) => {
  
  // Fungsi untuk membuka link berita di browser
  const handlePress = () => {
    if (post.url) {
      Linking.openURL(post.url);
    }
  };

  // Tampilan untuk kartu besar
  if (size === 'large') {
    return (
      <Pressable onPress={handlePress}>
        <Box rounded="$lg" m="$3" shadow="$2" bg="$white" overflow="hidden">
          <Image 
            source={{ uri: post.urlToImage || 'https://via.placeholder.com/600x400.png?text=News' }} 
            alt={post.title}
            h={200}
            w="100%"
          />
          <VStack p="$4" space="sm">
            <Text size="xs" color="$blue500" fontWeight="$bold" textTransform="uppercase">
              {post.source.name}
            </Text>
            <Heading size="md" isTruncated>{post.title}</Heading>
            <Text size="sm" color="$gray600" noOfLines={2}>
              {post.description}
            </Text>
          </VStack>
        </Box>
      </Pressable>
    );
  }

  // Tampilan untuk kartu kecil
  return (
    <Pressable onPress={handlePress} style={{ flex: 1 }}>
      <Box rounded="$lg" m="$2" shadow="$2" bg="$white" overflow="hidden" flex={1}>
        <Image 
          source={{ uri: post.urlToImage || 'https://via.placeholder.com/400x300.png?text=News' }} 
          alt={post.title}
          h={120}
          w="100%"
        />
        <VStack p="$3" space="xs">
          <Text size="xs" color="$blue500" fontWeight="$bold" textTransform="uppercase">
            {post.source.name}
          </Text>
          <Heading size="sm" noOfLines={3}>{post.title}</Heading>
        </VStack>
      </Box>
    </Pressable>
  );
};

export default NewsCard;