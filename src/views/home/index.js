import {
    Stack,
    Flex,
    Heading,
    Text,
    Box,
    Center,
  } from "@chakra-ui/react";
  import { useGetRemainingDoggies } from "../../hooks/useOneDoggiesData";
  import DoggieCard from "../../components/doggie-card";
  
  const Home = () => {
    const { remaining } = useGetRemainingDoggies();

    return (
      <Stack>
        <Stack
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          direction={{ base: "column-reverse", md: "row" }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
            >
              <Text as={"span"} color={"blue.400"}>
                ONEDoggies
              </Text>
            </Heading>
            <Text color={"gray.500"}>
              ONEDoggies is a collection of randomized cute dogs that reside on the Harmony ONE blockchain, they can be minted, breeded and traded!
            </Text>
            {remaining ? (
              <Text color={"blue.500"}>
                You can customize your Gen0 Doggies to your heart's content! There are currently {remaining} Gen0 Doggies, why not take one for youself?
              </Text>
            ) : (
              <Text color={"blue.500"}>
                You can customize your Gen0 Doggies to your heart's content! Please connect your wallet to see the remaining Gen0 doggies.
              </Text>
            )}
            <Text color={"blue.600"}>
              To mint your first doggie, go to Mint and customize your doggie to your linking!
            </Text>
          </Stack>
          <Flex
            flex={1}
            direction="column"
            justify={"center"}
            align={"center"}
            position={"relative"}
            w={"full"}
          >
          <Stack p="3" >
            <Box>
              <DoggieCard 
                primaryColor={10} 
                secondaryColor={11} 
                stomachColor={12} 
                backgroundColor={13}
                locketColor={1}
                beltColor={3}
                dotsColor={23}
                animationType={1}
                secret={1}
              ></DoggieCard>
            </Box>
          </Stack>
          </Flex>
        </Stack>

        <Stack>
        <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
            >
              <Center>
                <Text as={"span"} color={"blue.400"}>
                  Roadmap coming soon...🐾
                </Text>
              </Center>
            </Heading>
        </Stack>
      </Stack>
    );
  };
  
  export default Home;
  