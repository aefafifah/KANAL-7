import { Box, Image, Text, VStack, Heading, Pressable } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";

const NewsCard = ({ post, size = 'large' }) => {
  const router = useRouter();

  const getImageUrl = () => {
    if (!post?.urlToImage) return "";
    if (typeof post.urlToImage === "string") return post.urlToImage;
    if (post.urlToImage?.uri) return post.urlToImage.uri;
    return "";
  };

  const handlePress = () => {
    const newsId = String(post.newsId ?? post.id ?? "detail");
    const params = {
      id: newsId,
      title: post.title || "",
      description: post.description || "",
      sourceName: post.source?.name || "",
      imageUrl: getImageUrl(),
      url: post.url || post.link || "",
    };

    router.push({ pathname: "/news-detail/[id]", params });
  };

  if (size === 'large') {
    return (
      <Pressable onPress={handlePress}> 
        <Box rounded="$lg" m="$3" shadow="$2" bg="$white" overflow="hidden">
          <Image 
            source={post.urlToImage}
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

  return (
    <Pressable onPress={handlePress} style={{ flex: 1 }}>
      <Box rounded="$lg" m="$2" shadow="$2" bg="$white" overflow="hidden" flex={1}>
        <Image 
          source={post.urlToImage}
          alt={post.title}
          h={120}
          w="100%"
        />

        {/* FIX: Overlay diganti dengan Box */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p="$2"
          bg="rgba(0, 0, 0, 0.3)"
        >
          <Heading size="sm" color="$white" noOfLines={2}>
            {post.title}
          </Heading>
        </Box>
      </Box>
    </Pressable>
  );
};

export default NewsCard;
