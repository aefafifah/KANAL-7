import { ScrollView, Box } from "@gluestack-ui/themed";
import { Header, WaterCard, DailyGoal, BadgeCard, MoodTracker } from "../../components";

const Home = () => {
  return (
    <Box flex={1} bg="$white">
      {/* Header */}
      <Header title="Pengingat Minum" />

      {/* Konten utama */}
      <ScrollView>
        <Box p="$4">
          <WaterCard goal={8} />
          <DailyGoal initialGoal={8} />
          <MoodTracker />
          <BadgeCard 
            title="Hydration Hero" 
            description="Minum 8 gelas air hari ini!" 
          />
        </Box>
      </ScrollView>
    </Box>
  );
};

export default Home;
