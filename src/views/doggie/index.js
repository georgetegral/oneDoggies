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
    Center,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
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
  import { useOneDoggieData, useGetOffer } from "../../hooks/useOneDoggiesData";
  import { useParams } from "react-router-dom";
  import Loading from "../../components/loading";
  import { useState } from "react";
  import useOneDoggies from "../../hooks/useOneDoggies";
  import useMarketplace from "../../hooks/useMarketplace";
  import dogNames from "dog-names";

const Doggie = () =>{
    const { active, account, library } = useWeb3React();
    const { tokenId } = useParams();
    const { loading, doggie, update } = useOneDoggieData(tokenId);
    const { loading: loadingOffer, offer, update: updateOffer } = useGetOffer(tokenId);
    const toast = useToast();
    const oneDoggies = useOneDoggies();
    const marketplace = useMarketplace();

    //Transfer Modal variables
    const { isOpen: isOpenTransfer, onOpen: onOpenTransfer, onClose: onCloseTransfer } = useDisclosure();
    const [ transferAddress, setTransferAddress ] = useState("");
    const handleTransferChange = (event) => setTransferAddress(event.target.value);
    const [ transfering, setTransfering ] = useState(false);

    //Rename Modal variables
    const { isOpen: isOpenRename, onOpen: onOpenRename, onClose: onCloseRename } = useDisclosure();
    const [ rename, setRename ] = useState("");
    const [ suggestedName, setSuggestedName ] = useState(dogNames.allRandom());
    const handleRenameChange = (event) => setRename(event.target.value);
    const [ renaming, setRenaming ] = useState(false);

    //Sell Modal Variables
    const { isOpen: isOpenSell, onOpen: onOpenSell, onClose: onCloseSell } = useDisclosure();
    const [ price, setPrice ] = useState("");
    const handlePriceChange = (event) => setPrice(event.target.value);
    const [ selling, setSelling ] = useState(false);

    //Remove Offer Modal Variables
    const { isOpen: isOpenRemoveOffer, onOpen: onOpenRemoveOffer, onClose: onCloseRemoveOffer } = useDisclosure();
    const [ removing, setRemoving ] = useState(false);

    //Buy Variables
    const [ buying, setBuying ] = useState(false);

    function randomSuggestion(){
      setSuggestedName(dogNames.allRandom());
    }

    const convertDate = (date) => {
      var newDate = new Date(date * 1000);
      return newDate.toLocaleString();
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
                onCloseTransfer();
                update();
            });
            setTransfering(false);
        }
    }

    const renameDoggie = () => {
        setRenaming(true);
        if(!rename) {
            toast({
                title: "Empty name.",
                description: "Your doggie's new name cannot be empty!",
                status: "error",
                isClosable: true,
            });
            setRenaming(false);
        }
        else {
            oneDoggies.methods.updateName(tokenId, rename).send({
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
                    description: `This Doggie's new name is ${rename}!`,
                    status: "success",
                    isClosable: true,
                });
                onCloseRename();
                update();
            });
            setRenaming(false);
        }
    }

    const sell = () => {
      setSelling(true);
      if(!price){
        toast({
            title: "Empty price.",
            description: "Your selling price cannot be empty!",
            status: "error",
            isClosable: true,
        });
        setSelling(false);
      } else if (price <= 0) {
        toast({
          title: "Empty price.",
          description: "Your selling price cannot be zero or less!",
          status: "error",
          isClosable: true,
        });
        setSelling(false);
      } else if (price <= .01){
        toast({
          title: "Price too low.",
          description: "Your selling price cannot be less than .01 ONE!",
          status: "error",
          isClosable: true,
        });
        setSelling(false);
      } else {
        //Convert price to wei
        //1 ETH = 18 zeros wei
        //.01 ETH = 16 zeros wei
        var priceWei = library.utils.toWei(price);
        marketplace.methods.setOffer(priceWei, tokenId).send({
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
                description: `This Doggie's has been put in the marketplace for ${price} ONE!`,
                status: "success",
                isClosable: true,
            });
            onCloseSell();
            
        });

        marketplace.events
        .MarketTransaction()
        .on('data', function(event){
          updateOffer();
        })
        .on("error", (error) => {
            toast({
                title: "Market Transaction failed",
                description: error.message,
                status: "error",
                isClosable: true,
            })
        })
        
        
      }
      setSelling(false);
    }

    const removeOffer = () => {
      setRemoving(true);

      marketplace.methods.removeOffer(tokenId).send({
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
              description: `This Doggie's has been removed from the marketplace!`,
              status: "success",
              isClosable: true,
          });
          onCloseRemoveOffer();
          
      });

      marketplace.events
      .MarketTransaction()
      .on('data', function(event){
        updateOffer();
      })
      .on("error", (error) => {
          toast({
              title: "Market Transaction failed",
              description: error.message,
              status: "error",
              isClosable: true,
          })
      })

      setRemoving(false);
    }

    const buy = () => {
      var sellPrice = offer.price;
      console.log(sellPrice);
      setBuying(true);

      marketplace.methods.buyDoggie(tokenId).send({
        from: account,
        value: sellPrice
      })
      .on("error", (error) => {
          toast({
              title: "Transaction failed",
              description: error.message,
              status: "error",
              isClosable: true,
          });
          setBuying(false);
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
              description: `Congratulations! You have bought this doggie!`,
              status: "success",
              isClosable: true,
          });
          
      });
      
      marketplace.events
      .MarketTransaction()
        .on('data', function(event){
          update();
          updateOffer();
        })
        .on("error", (error) => {
            toast({
                title: "Market Transaction failed",
                description: error.message,
                status: "error",
                isClosable: true,
            })
        })
      setBuying(false);
    }

  if (!active) return <RequestAccess />;

  if (loading || loadingOffer) return <Loading />;

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
          onClick={onOpenTransfer} 
          disabled={account !== doggie.owner} 
          colorScheme="teal"
          isLoading={transfering}
        >
          {account !== doggie.owner ? "You are not the owner." : "Transfer"}
        </Button>
        <Button 
          onClick={onOpenRename} 
          disabled={account !== doggie.owner} 
          colorScheme="blue"
          isLoading={renaming}
        >
          {account !== doggie.owner ? "You are not the owner." : "Rename"}
        </Button>
        {account === doggie.owner ? 
          (offer != null && offer.active ? (
            <Stack>
              <Center><Text fontWeight={600}>Sell price: {library.utils.fromWei(offer.price)} ONE</Text></Center>
              <Button 
                onClick={onOpenRemoveOffer} 
                disabled={account !== doggie.owner} 
                colorScheme="red"
                isLoading={removing}
              >
                {account !== doggie.owner ? "You are not the owner." : "Remove Offer"}
              </Button>
            </Stack>
          ) : (
            <Button 
              onClick={onOpenSell} 
              disabled={account !== doggie.owner} 
              colorScheme="yellow"
              isLoading={selling}
            >
              {account !== doggie.owner ? "You are not the owner." : "Sell"}
            </Button>
          )) : (offer != null && offer.active ? (
            <Stack>
              <Center><Text fontWeight={600}>Sell price: {library.utils.fromWei(offer.price)} ONE</Text></Center>
              <Button 
              onClick={buy} 
              disabled={account === doggie.owner} 
              colorScheme="green"
              isLoading={buying}
            >
              {account === doggie.owner ? "The owner cannot buy it's own Doggie." : "Buy"}
            </Button>
            </Stack>
          ) : (
            <Button
              disabled={true}
              colorScheme="gray"
            >
              No offer available
            </Button>
          )
          
        )}
        
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
            {doggie.dadId}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          Mom ID:
          <Tag ml={2} colorScheme="green">
            {doggie.momId}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          Birth time:
          <Tag ml={2} colorScheme="green">
            {convertDate(doggie.birthTime)}
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

      <Modal blockScrollOnMount={false} isOpen={isOpenTransfer} onClose={onCloseTransfer} isCentered>
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
            <Button colorScheme='red' mr={3} onClick={onCloseTransfer}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal blockScrollOnMount={false} isOpen={isOpenRename} onClose={onCloseRename} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rename your Doggie.</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight='bold'>
                Give it a cool name!
            </Text>
            <Input 
                variant='flushed' 
                placeholder={`How about "${suggestedName}"?`}
                mb='1rem'
                value={rename}
                onChange={handleRenameChange}
            />
          </ModalBody>

          <ModalFooter>
          <Button colorScheme='blue' size="md" justifyContent="flex-start" marginRight={"auto"} onClick={randomSuggestion}>Suggest name</Button>
            <Button colorScheme='green' mr={3} onClick={renameDoggie}>
              Rename
            </Button>
            <Button colorScheme='red' mr={3} onClick={onCloseRename}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal blockScrollOnMount={false} isOpen={isOpenSell} onClose={onCloseSell} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sell your doggie.</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
            <Text fontWeight='bold'>
                This will put your Doggie on the marketplace.
            </Text>
            <InputGroup >
              <InputLeftAddon children='Price:' />
              <Input 
                  placeholder={`Set your price`}
                  mb='1rem'
                  value={price}
                  onChange={handlePriceChange}
              />
              <InputRightAddon children='ONE' />
            </InputGroup>
            <Text fontWeight='bold' mb='1rem'>
              Are you sure you want to sell it?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='green' mr={3} onClick={sell}>
              Sell
            </Button>
            <Button colorScheme='red' mr={3} onClick={onCloseSell}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal blockScrollOnMount={false} isOpen={isOpenRemoveOffer} onClose={onCloseRemoveOffer} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Remove offer for your doggie.</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
            <Text fontWeight='bold'>
                This remove your Doggie off the marketplace.
            </Text>
            <Text fontWeight='bold' mb='1rem'>
              Are you sure you want to remove the offer?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='green' mr={3} onClick={removeOffer}>
              Remove
            </Button>
            <Button colorScheme='red' mr={3} onClick={onCloseRemoveOffer}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Stack>
  );
}

export default Doggie;