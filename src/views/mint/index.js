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
    <Flex minH="100vh" direction="column">
     <Center>
        <Box p="5" borderWidth="2px">
          <Box paddingLeft={59} paddingRight={59} borderWidth="2px" backgroundColor={"#D8BFD8"}>
            <div className="ears"></div>
            <div className="dog">
                <div className="body">
                  <div className="eyes"></div>
                  <div className="beard">
                    <div className="mouth">
                      <div className="tongue"></div>
                    </div>
                  </div>
                  <div className="belt">
                    <div className="locket"></div>
                    <div className="dot dot1"></div>
                    <div className="dot dot2"></div>
                    <div className="dot dot3"></div>
                    <div className="dot dot4"></div>
                    <div className="tag"></div>
                  </div>
                  <div className="stomach">
                  </div>
                  <div className="legs">
                    <div className="left"></div>
                    <div className="right"></div>
                  </div>
                </div>
                <div className="tail"></div>
              </div>
              
            </Box>
            
            
        </Box>

        </Center>

    </Flex>

    );
  };
  
  export default Mint;
  