import { useState } from "react";
import { Box, Text, HStack, Image, Button } from "@gluestack-ui/themed";

const BadgeCard = ({
  title = "Raja Hidrasi 💧",
  description = "Minum air 8 gelas berturut-turut!",
  image,
}) => {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <Box
      bg={unlocked ? "$blue50" : "$coolGray100"}
      borderWidth={1}
      borderColor={unlocked ? "$blue500" : "$coolGray300"}
      rounded="$lg"
      p="$4"
      my="$2"
      alignItems="center"
    >
      <HStack alignItems="center" space="md">
        <Image
          source={image || require("../assets/water.png")}
          alt="Badge Icon"
          w="$12"
          h="$12"
          opacity={unlocked ? 1 : 0.5}
        />
        <Box flex={1}>
          <Text
            fontSize="$lg"
            fontWeight="$bold"
            color={unlocked ? "$blue700" : "$coolGray700"}
          >
            {title}
          </Text>
          <Text color="$coolGray500" fontSize="$sm">
            {description}
          </Text>
        </Box>
      </HStack>

      <Button
        mt="$3"
        size="sm"
        bg={unlocked ? "$red600" : "$blue600"}
        onPress={() => setUnlocked(!unlocked)}
      >
        <Text color="$white">
          {unlocked ? "Kunci Ulang" : "Buka Badge"}
        </Text>
      </Button>
    </Box>
  );
};

export default BadgeCard;
