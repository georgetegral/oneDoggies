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
            .on("error", (error) => {
                toast({
                    title: "Transaction failed",
                    description: error.message,
                    status: "error",
                })
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
            setTransfering(false);
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
        <Stack>
        <Box paddingLeft={5} paddingRight={5}>
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
        </Box>
        <Button 
          onClick={transfer} 
          disabled={account !== doggie.owner} 
          colorScheme="green"
          isLoading={transfering}
        >
          {account !== doggie.owner ? "You are not the owner." : "Transfer"}
        </Button>
        </Stack>
        <Stack width="100%" spacing={5}>
        <Heading>{doggie.doggieName}</Heading>
        <Text fontSize="xl">{doggie.description}</Text>
        <Text fontWeight={600}>
          Token ID:
          <Tag ml={2} colorScheme="green">
            {doggie.tokenId}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          Generation:
          <Tag ml={2} colorScheme="green">
            {doggie.generation}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          Dad ID:
          <Tag ml={2} colorScheme="green">
            {doggie.momId}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          Mom ID:
          <Tag ml={2} colorScheme="green">
            {doggie.dadId}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          Birth time:
          <Tag ml={2} colorScheme="green">
            {doggie.birthTime}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          DNA:
          <Tag ml={2} colorScheme="green">
            {doggie.dna}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          Owner:
          <Tag ml={2} colorScheme="green">
            {doggie.owner}
          </Tag>
        </Text>
        
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Attribute</Th>
              <Th>value</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(doggie.attributes[0]).map(([key, value]) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>
                  <Tag>{value}</Tag>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Stack>
  );
}

export default Doggie;