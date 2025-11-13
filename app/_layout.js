// import { Stack } from "expo-router";
// import { GluestackUIProvider } from "@gluestack-ui/themed";
// import { config } from "@gluestack-ui/config";

// const noHead = { headerShown: false };

// const StackLayout = () => {
//   return (
//     <GluestackUIProvider config={config}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={noHead} />
//         <Stack.Screen name="login" options={noHead} />
//         <Stack.Screen name="register" options={noHead} />
//         <Stack.Screen name="report" options={noHead} />
//       </Stack>
//     </GluestackUIProvider>
//   );
// };

// export default StackLayout;

import { Stack } from "expo-router";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

const noHeader = { headerShown: false };

export default function Layout() {
  return (
    <GluestackUIProvider config={config}>
      <Stack>
        {/* Default: login jadi halaman pertama */}
        <Stack.Screen name="login" options={noHeader} />
        <Stack.Screen name="register" options={noHeader} />
        <Stack.Screen name="(tabs)" options={noHeader} />
      </Stack>
    </GluestackUIProvider>
  );
}