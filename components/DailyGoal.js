import { useState } from "react";
import { Box, Input, Text } from "@gluestack-ui/themed";

const DailyGoal = ({ initialGoal = 8 }) => {
  const [goal, setGoal] = useState(initialGoal);
  return (
    <Box p="$4">
      <Text fontSize="$lg" mb="$2">Target Harian Anda</Text>
      <Input
        keyboardType="numeric"
        placeholder="Masukkan jumlah gelas"
        value={String(goal)}
        onChangeText={(v) => setGoal(Number(v))}
      />
    </Box>
  );
};

export default DailyGoal;
    