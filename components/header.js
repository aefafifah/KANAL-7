import { Box, HStack, Heading } from "@gluestack-ui/themed";
import { SafeAreaView, StatusBar } from "react-native";

const Header = ({ title }) => {
  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      <Box bg="$blue600" p="$4">
        <HStack justifyContent="center" alignItems="center">
          <Heading color="$white">{title}</Heading>
        </HStack>
      </Box>
    </SafeAreaView>
  );
};

export default Header;
