// import { GluestackUIProvider, Box, ScrollView } from "@gluestack-ui/themed";
// import { config } from "@gluestack-ui/config";
// import { Header, WaterCard, DailyGoal} from "../components";

// export default function AppIndex() {
//   return (
//     <GluestackUIProvider config={config}>
//       <Box flex={1} bg="$white">
//         {/* Header */}
//         <Header title="Pengingat Minum" />

//         {/* Konten utama scrollable */}
//         <ScrollView>
//           <Box p="$4">
//             <WaterCard goal={8} />
//             <DailyGoal initialGoal={8} />
//           </Box>
//         </ScrollView>
//       </Box>
//     </GluestackUIProvider>
//   );
// }

import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login"); // arahkan langsung ke halaman login
  }, []);

  return null;
}