import {
    Stack,
    Flex,
    Heading,
    Text,
    Button,
    Image,
    useToast,
    Link as LinkChakra
  } from "@chakra-ui/react";
  import { ExternalLinkIcon } from '@chakra-ui/icons'
  import { Link } from "react-router-dom";
  import { useWeb3React } from "@web3-react/core";
  import useRandomAvatars from "../../hooks/useRandomAvatars";
  import { useCallback, useEffect, useState } from "react";
  
  const Home = () => {
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
              Random Avatars
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            Random Avatars es una colección de Avatars randomizados cuya metadata
            es almacenada on-chain. Solo hay 10000 en existencia.
          </Text>
          <Text color={"blue.500"}>
            Cada Random Avatar se genera de forma aleatoria utilizando la Chainlink 
            "Verifiable Randomness Function" para obtener un número aleatorio no determinístico. La colección corre en la red de pruebas Rinkeby.
          </Text>
          <Text color={"blue.600"}>
            Para mintear tu avatar, da click en "Obtén tu avatar", y acepta la transacción en tu
            billetera Metamask, espera 3 minutos para que tu avatar sea minteado con éxito. Lo podrás ver en la galería.
          </Text>
          <Text>
            <LinkChakra href='https://testnets.opensea.io/collection/randomavatars-y9f9j609az' isExternal>
             Ver la galería en OpenSea. <ExternalLinkIcon mx='2px' />
            </LinkChakra>
          </Text>
          <Text color={"blue.700"}>
            Avatars disponibles : {availableAvatars}
          </Text>
          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={{ base: "column", sm: "row" }}
          >
            <Button
              rounded={"full"}
              size={"lg"}
              fontWeight={"normal"}
              px={6}
              colorScheme={"blue"}
              bg={"blue.400"}
              _hover={{ bg: "blue.500" }}
              disabled={!randomAvatars}
              onClick={mint}
              isLoading={isMinting}
            >
              Obtén tu avatar
            </Button>
            <Link to="/avatars">
              <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6}>
                Galería
              </Button>
            </Link>
          </Stack>
        </Stack>
        <Flex
          flex={1}
          direction="column"
          justify={"center"}
          align={"center"}
          position={"relative"}
          w={"full"}
        >
          <Image src={"https://api.multiavatar.com/Binx Bond.svg"} />
        </Flex>
      </Stack>
    );
  };
  
  export default Home;
  