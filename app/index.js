import { GluestackUIProvider, Box, ScrollView } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { Header, WaterCard, DailyGoal} from "../components";

export default function AppIndex() {
  return (
    <GluestackUIProvider config={config}>
      <Box flex={1} bg="$white">
        {/* Header */}
        <Header title="Pengingat Minum" />

        {/* Konten utama scrollable */}
        <ScrollView>
          <Box p="$4">
            <WaterCard goal={8} />
            <DailyGoal initialGoal={8} />
          </Box>
        </ScrollView>
      </Box>
    </GluestackUIProvider>
  );
}
