import {
  Box,
  HStack,
  VStack,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Text,
  Link,
  LinkText,
  Button,
  ButtonText,
  Icon,
  ButtonIcon
} from "@gluestack-ui/themed";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal } from "lucide-react-native";

// Komponen ini menerima 'post' sebagai prop
const CommunityPostCard = ({ post }) => {
  return (
    <Box bg="$white" p="$4" rounded="$lg" m="$2" shadow="$1">
      {/* Bagian Header Kartu */}
      <HStack space="md" alignItems="center" mb="$3">
        <Avatar size="md" bgColor="$blue200">
          <AvatarFallbackText>{post.userName.charAt(0)}</AvatarFallbackText>
          {/* <AvatarImage source={{ uri: post.avatarUrl }} /> */}
        </Avatar>
        <VStack flex={1}>
          <Text fontWeight="$bold" size="md">{post.userName}</Text>
          <Text size="sm" color="$gray500">{post.timestamp}</Text>
        </VStack>
        <Button variant="link" size="xl" onPress={() => alert('Menu...')}>
          <Icon as={MoreHorizontal} color="$gray600" />
        </Button>
      </HStack>

      {/* Bagian Konten Kartu */}
      <VStack space="sm">
        <Text mb="$2">{post.postText}</Text>
        {post.postLink && (
          <Link href={post.postLink} isExternal>
            <LinkText color="$blue500" textDecorationLine="underline">
              {post.postLink}
            </LinkText>
          </Link>
        )}
      </VStack>

      {/* Bagian Aksi (Suka, Komentar, Bagi) */}
      <HStack mt="$4" justifyContent="space-around" borderTopWidth="$1" borderColor="$gray200" pt="$3">
        <Button variant="link" colorScheme="blue">
          <ButtonIcon as={ThumbsUp} size="md" mr="$2" />
          <ButtonText>Suka</ButtonText>
        </Button>
        <Button variant="link" colorScheme="blue">
          <ButtonIcon as={MessageCircle} size="md" mr="$2" />
          <ButtonText>Komentar</ButtonText>
        </Button>
        <Button variant="link" colorScheme="blue">
          <ButtonIcon as={Share2} size="md" mr="$2" />
          <ButtonText>Bagi</ButtonText>
        </Button>
      </HStack>
    </Box>
  );
};

export default CommunityPostCard;