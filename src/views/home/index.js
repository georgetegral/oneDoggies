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
  import { useCallback, useEffect, useState } from "react";
  
  const Home = () => {
    const [isMinting, setIsMinting] = useState(false);
    const { account } = useWeb3React();
    const toast = useToast();

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
          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={{ base: "column", sm: "row" }}
          >
            
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
  