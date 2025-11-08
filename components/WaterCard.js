import { useState } from "react";
import { Box, Text, Button } from "@gluestack-ui/themed";

const WaterCard = ({ goal = 8 }) => {
  const [count, setCount] = useState(0);

  return (
    <Box p="$4" bg="$blue50" rounded="$lg" m="$2" alignItems="center">
      <Text fontSize="$lg" mb="$2">Jumlah Gelas Hari Ini</Text>
      <Text fontSize="$2xl" fontWeight="$bold">{count} / {goal}</Text>
      <Button mt="$3" onPress={() => setCount(count + 1)}>Tambah Gelas</Button>
    </Box>
  );
};

export default WaterCard;
