import {
    Stack,
    Flex,
    Heading,
    Text,
    Button,
    Image,
    Box,
    useToast,
    useColorModeValue,
    Center,
    Badge,
    Link as LinkChakra
  } from "@chakra-ui/react";
  import DoggieCard from "../../components/doggie-card";
  import { ExternalLinkIcon } from '@chakra-ui/icons'
  import { Link } from "react-router-dom";
  import { useWeb3React } from "@web3-react/core";
  import useRandomAvatars from "../../hooks/useRandomAvatars";
  import { useCallback, useEffect, useState } from "react";
  
  const Mint = () => {
    const [isMinting, setIsMinting] = useState(false);
    const [availableAvatars, setAvailableAvatars] = useState("");
    const { account } = useWeb3React();
    const randomAvatars = useRandomAvatars();
    const toast = useToast();
  
    const getRandomAvatarsData = useCallback(async () => {
      if (randomAvatars) {
        const totalSupply = await randomAvatars.methods.totalSupply().call();

        const maxSupply = await randomAvatars.methods.maxSupply().call();
        setAvailableAvatars(maxSupply - totalSupply); 

      }
    }, [randomAvatars]);
  
    useEffect(() => {
      getRandomAvatarsData();
    }, [getRandomAvatarsData]);
  
    const mint = () => {
        setIsMinting(true);

        randomAvatars.methods
        .mint()
        .send({
            from: account
            //value: 1e15
        })
        .on("transactionHash", (txHash) => {
            toast({
                title: "Transacción enviada",
                description: txHash,
                status: "info",
            })
        })
        .on("receipt", () => {
            toast({
                title: "Transacción confirmada",
                description: "Se ha minteado correctamente el avatar",
                status: "success",
            })
        })
        .on("error", (error) => {
            toast({
                title: "Transacción fallida",
                description: error.message,
                status: "error",
            })
        })

        setIsMinting(false);
    }

    return (
        /*
        <Center h="100vh">
      <Box p="5" maxW="320px" borderWidth="1px">
        <Image borderRadius="md" src="https://bit.ly/2k1H1t6" />
        <Flex align="baseline" mt={2}>
          <Badge colorScheme="pink">Plus</Badge>
          <Text
            ml={2}
            textTransform="uppercase"
            fontSize="sm"
            fontWeight="bold"
            color="pink.800"
          >
            Verified &bull; Cape Town
          </Text>
        </Flex>
        <Text mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">
          Modern, Chic Penthouse with Mountain, City & Sea Views
        </Text>
        <Text mt={2}>$119/night</Text>
        <Flex mt={2} align="center">
          <Text ml={1} fontSize="sm">
            <b>4.84</b> (190)
          </Text>
        </Flex>
      </Box>
    </Center>
    */
    <Stack direction="column">
      <Heading
        lineHeight={1.1}
        fontWeight={600}
        fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
      >
        <Text as={"span"} color={"blue.400"}>
          Mint your Doggie!
        </Text>
      </Heading>

     <Center borderWidth="2px">
      <Stack p="5" spacing={{ base: 5, md: 1 }}>
        <Box>
          <DoggieCard></DoggieCard>
        </Box>
        <Text>DNA: </Text>
      </Stack>
        
        <Stack
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          w={"full"}
        >
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }}
          >
            <Text as={"span"} color={"blue.400"}>
              Select your Doggie Attributes
            </Text>
          </Heading>
          <Text>woaah</Text>
        </Stack>

      </Center>

      
    </Stack>

    );
  };
  
  export default Mint;
  