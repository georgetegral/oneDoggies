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
    Box,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
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

    //Modal variables
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ transferAddress, setTransferAddress ] = useState("");
    const handleTransferChange = (event) => setTransferAddress(event.target.value);

    const openTransferModal = () => {
        onOpen();
    }

    const transfer = () => {
        setTransfering(true);
        const isAddress = library.utils.isAddress(transferAddress);
        if(!isAddress) {
            toast({
                title: "Invalid address.",
                description: "This address is not an Ethereum address.",
                status: "error",
                isClosable: true,
            });
            setTransfering(false);
        } else if(transferAddress === doggie.owner){
            toast({
                title: "Invalid address.",
                description: "You can't transfer the Doggie to yourself! Silly.",
                status: "error",
                isClosable: true,
            });
            setTransfering(false);
        }else {
            oneDoggies.methods.safeTransferFrom(doggie.owner, transferAddress, doggie.tokenId).send({
                from: account
            })
            .on("error", (error) => {
                toast({
                    title: "Transaction failed",
                    description: error.message,
                    status: "error",
                    isClosable: true,
                })
            })
            .on("transactionHash", (txHash) => {
                toast({
                    title: "Transaction sent.",
                    description: txHash,
                    status: "info",
                    isClosable: true,
                });
            })
            .on("receipt", () => {
                toast({
                    title: "Transaction confirmed.",
                    description: `This Doggie now belongs to ${transferAddress}`,
                    status: "success",
                    isClosable: true,
                });
                onClose();
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
          onClick={openTransferModal} 
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

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transfer your Doggie.</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight='bold'>
                Once transfered, the action cannot be reversed.
            </Text>
            <Input 
                variant='flushed' 
                placeholder='Input a valid Ethereum address' 
                mb='1rem'
                value={transferAddress}
                onChange={handleTransferChange}
            />
            <Text fontWeight='bold' mb='1rem'>
              Are you sure you want to transfer?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='green' mr={3} onClick={transfer}>
              Transfer
            </Button>
            <Button colorScheme='red' mr={3} onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Stack>
  );
}

export default Doggie;