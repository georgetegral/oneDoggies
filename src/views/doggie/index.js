import {
    Stack,
    Heading,
    Text,
    Table,
    Thead,
    Tr,
    Th,
    Td,
    Tbody,
    Button,
    Tag,
    useToast,
    Box
  } from "@chakra-ui/react";
  import { useWeb3React } from "@web3-react/core";
  import RequestAccess from "../../components/request-access";
  import DoggieCard from "../../components/doggie-card";
  import { useOneDoggieData } from "../../hooks/useOneDoggiesData";
  import { useParams } from "react-router-dom";
  import Loading from "../../components/loading";
  import { useState } from "react";
  import useOneDoggies from "../../hooks/useOneDoggies";

const Doggie = () =>{
    const { active, account, library } = useWeb3React();
    const { tokenId } = useParams();
    const { loading, doggie, update } = useOneDoggieData(tokenId);
    const toast = useToast();
    const [ transfering, setTransfering ] = useState(false);
    const oneDoggies = useOneDoggies();

    const transfer = () => {
        setTransfering(true);
        const address = prompt("Enter the new address: ");
        const isAddress = library.utils.isAddress(address);
        if(!isAddress) {
        toast({
            title: "Invalid address.",
            description: "This address is not an Ethereum address.",
            status: "error"
        });
        setTransfering(false);
        } else {
        oneDoggies.methods.safeTransferFrom(doggie.owner, address, doggie.tokenId).send({
            from: account
        })
        .on("error", () => {
            setTransfering(false);
        })
        .on("transactionHash", (txHash) => {
            toast({
            title: "Transaction sent.",
            description: txHash,
            status: "info",
            });
        })
        .on("receipt", () => {
            toast({
            title: "Transaction confirmed.",
            description: `This Doggie now belongs to ${address}`,
            status: "success"
            });
            update();
        });
        
    }
  }

  if (!active) return <RequestAccess />;

  if (loading) return <Loading />;

  return (
    <Stack
      spacing={{ base: 8, md: 10 }}
      py={{ base: 5 }}
      direction={{ base: "column", md: "row" }}
    >
        <Box paddingLeft={5} paddingRight={5} borderWidth="1px">
            <DoggieCard
                primaryColor={parseInt(doggie.attributes[0]['Primary Color'])} 
                secondaryColor={parseInt(doggie.attributes[0]['Secondary Color'])} 
                stomachColor={parseInt(doggie.attributes[0]['Stomach Color'])} 
                backgroundColor={parseInt(doggie.attributes[0]['Background Color'])}
                locketColor={parseInt(doggie.attributes[0]['Locket Color'])}
                beltColor={parseInt(doggie.attributes[0]['Belt Color'])}
                dotsColor={parseInt(doggie.attributes[0]['Dots Color'])}
                animationType={parseInt(doggie.attributes[0]['Animation Type'])}
                secret={parseInt(doggie.attributes[0]['Secret'])}
            />
            <Box display='flex'>
                <Text>ONEDoggie #{tokenId}</Text>
                <Text marginLeft={"auto"}>Gen: {doggie.generation}</Text>
            </Box>
            <Text>DNA: {doggie.dna} 🐾</Text>
        </Box>
    </Stack>
  );
}

export default Doggie;