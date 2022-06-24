import {
    Stack,
    Heading,
    Text,
    Button,
    ButtonGroup,
    Tag,
    useToast,
    Box,
    Input,
    Center,
    SimpleGrid,
    Select,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
  } from "@chakra-ui/react";
  import { useWeb3React } from "@web3-react/core";
  import RequestAccess from "../../components/request-access";
  import DoggieCard from "../../components/doggie-card";
  import useOneDoggies from "../../hooks/useOneDoggies";
  import { useOneDoggiesData, useGetBreedData, useGetPrices } from "../../hooks/useOneDoggiesData";
  import { useState } from "react";
  import dogNames from "dog-names";

const Breed = () => {
    const { active, account, library } = useWeb3React();
    const toast = useToast();
    const oneDoggies = useOneDoggies();
    const { doggies } = useOneDoggiesData({
        owner: account
      });
    const [ breeding, setBreeding ] = useState(false);
    const [ newName, setNewName ] =useState("");
    const [ suggestedName, setSuggestedName ] = useState(dogNames.allRandom());
    const handleChange = (event) => setNewName(event.target.value);
    const { isOpen, onOpen, onClose } = useDisclosure();

    //Dad variables
    const [dadId, setDadId] = useState();
    const [hasSelectedDad, setHasSelectedDad] = useState(false);
    const [primaryColorDad, setPrimaryColorDad] = useState(0);
    const [secondaryColorDad, setSecondaryColorDad] = useState(0);
    const [stomachColorDad, setStomachColorDad] = useState(0);
    const [backgroundColorDad, setBackgroundColorDad] = useState(0);
    const [locketColorDad, setLocketColorDad] = useState(0);
    const [beltColorDad, setBeltColorDad] = useState(0);
    const [dotsColorDad, setDotsColorDad] = useState(0);
    const [animationTypeDad, setAnimationTypeDad] = useState(0);
    const [secretDad, setSecretDad] = useState(0);
    const [dnaDad, setDnaDad] = useState(0);
    const [generationDad, setGenerationDad] = useState(0);
    const [nameDad, setNameDad] = useState(0);
    const [momIdDad, setMomIdDad] = useState(0);
    const [dadIdDad, setDadIdDad] = useState(0);
    const [birthTimeDad, setBirthTimeDad] = useState(0);
    const [timesBreededDad, setTimesBreededDad] = useState(0);
    const [localTimesBreededDad, setLocalTimesBreededDad] = useState(0);

    //Mom variables
    const [momId, setMomId] = useState();
    const [hasSelectedMom, setHasSelectedMom] = useState(false);
    const [primaryColorMom, setPrimaryColorMom] = useState(0);
    const [secondaryColorMom, setSecondaryColorMom] = useState(0);
    const [stomachColorMom, setStomachColorMom] = useState(0);
    const [backgroundColorMom, setBackgroundColorMom] = useState(0);
    const [locketColorMom, setLocketColorMom] = useState(0);
    const [beltColorMom, setBeltColorMom] = useState(0);
    const [dotsColorMom, setDotsColorMom] = useState(0);
    const [animationTypeMom, setAnimationTypeMom] = useState(0);
    const [secretMom, setSecretMom] = useState(0);
    const [dnaMom, setDnaMom] = useState(0);
    const [generationMom, setGenerationMom] = useState(0);
    const [nameMom, setNameMom] = useState(0);
    const [momIdMom, setMomIdMom] = useState(0);
    const [dadIdMom, setDadIdMom] = useState(0);
    const [birthTimeMom, setBirthTimeMom] = useState(0);
    const [timesBreededMom, setTimesBreededMom] = useState(0);
    const [localTimesBreededMom, setLocalTimesBreededMom] = useState(0);

    //Breed prices and data
    const { loading: loadingGetBreedCost, breedCost,  update: updateGetBreedCost } = useGetBreedData();
    const { breedLimit } = useGetPrices();

    //Breeded Modal variables
    const [ doggieId, setDoggieId ] = useState(0);
    const [ momIdMint, setMomIdMint ] = useState(0);
    const [ dadIdMint, setDadIdMint ] = useState(0);
    const [ dnaMint, setDnaMint ] = useState(0);
    const [ doggieOwner, setDoggieOwner ] = useState(0);
    const [ mintedName, setMintedName ] = useState(0);
    
    const convertDate = (date) => {
        var newDate = new Date(date * 1000);
        return newDate.toLocaleString();
    }

    function checkIds(){
        if (dadId === momId){
            return false;
        }
        else{
            return true
        }
    }

    function randomName(){
        setNewName(dogNames.allRandom());
      }
      function randomSuggestion(){
        setSuggestedName(dogNames.allRandom());
      }

    function getDoggieIndex(tokenId){
        return doggies.findIndex(obj => obj.tokenId === tokenId);
    }

    const updateDad = (tokenId) => {
        if(tokenId){
            setDadId(tokenId);
            setHasSelectedDad(true);
            var idx = getDoggieIndex(tokenId);
            
            setPrimaryColorDad(parseInt(doggies[idx].attributes[0]['Primary Color']));
            setSecondaryColorDad(parseInt(doggies[idx].attributes[0]['Secondary Color']));
            setStomachColorDad(parseInt(doggies[idx].attributes[0]['Stomach Color']));
            setBackgroundColorDad(parseInt(doggies[idx].attributes[0]['Background Color']));
            setLocketColorDad(parseInt(doggies[idx].attributes[0]['Locket Color']));
            setBeltColorDad(parseInt(doggies[idx].attributes[0]['Belt Color']));
            setDotsColorDad(parseInt(doggies[idx].attributes[0]['Dots Color']));
            setAnimationTypeDad(parseInt(doggies[idx].attributes[0]['Animation Type']));
            setSecretDad(parseInt(doggies[idx].attributes[0]['Secret']));
            setDnaDad(parseInt(doggies[idx].dna));
            setGenerationDad(parseInt(doggies[idx].generation));
            setNameDad(doggies[idx].doggieName);
            setMomIdDad(doggies[idx].momId);
            setDadIdDad(doggies[idx].dadId);
            setBirthTimeDad(doggies[idx].birthTime);
            setTimesBreededDad(doggies[idx].timesBreeded);
            setLocalTimesBreededDad(doggies[idx].timesBreeded);
        }
        else{
            setDadId("");
            setHasSelectedDad(false);
        }
        updateGetBreedCost(tokenId, momId);
    }

    const updateMom = (tokenId) => {
        if(tokenId){
            setMomId(tokenId);
            setHasSelectedMom(true);
            var idx = getDoggieIndex(tokenId);
            
            setPrimaryColorMom(parseInt(doggies[idx].attributes[0]['Primary Color']));
            setSecondaryColorMom(parseInt(doggies[idx].attributes[0]['Secondary Color']));
            setStomachColorMom(parseInt(doggies[idx].attributes[0]['Stomach Color']));
            setBackgroundColorMom(parseInt(doggies[idx].attributes[0]['Background Color']));
            setLocketColorMom(parseInt(doggies[idx].attributes[0]['Locket Color']));
            setBeltColorMom(parseInt(doggies[idx].attributes[0]['Belt Color']));
            setDotsColorMom(parseInt(doggies[idx].attributes[0]['Dots Color']));
            setAnimationTypeMom(parseInt(doggies[idx].attributes[0]['Animation Type']));
            setSecretMom(parseInt(doggies[idx].attributes[0]['Secret']));
            setDnaMom(parseInt(doggies[idx].dna));
            setGenerationMom(parseInt(doggies[idx].generation));
            setNameMom(doggies[idx].doggieName);
            setMomIdMom(doggies[idx].momId);
            setDadIdMom(doggies[idx].dadId);
            setBirthTimeMom(doggies[idx].birthTime);
            setTimesBreededMom(doggies[idx].timesBreeded);
            setLocalTimesBreededMom(doggies[idx].timesBreeded);
        }
        else{
            setMomId("");
            setHasSelectedMom(false);
        }
        updateGetBreedCost(dadId, tokenId);
    }

    const breed = () => {
        setBreeding(true);

        if(!checkIds()){
            toast({
                title: "Invalid selection",
                description: "You can't breed a doggie with itself!",
                status: "error",
                isClosable: true,
            });
            setBreeding(false);
        } else if (localTimesBreededMom >= breedLimit || localTimesBreededDad >= breedLimit){
            toast({
                title: "Breeded too many times",
                description: "You can't breed a doggie more than 5 times!",
                status: "error",
                isClosable: true,
            });
            setBreeding(false);
        } else {
            oneDoggies.methods.breed(dadId, momId, newName).send({
                from: account,
                value: breedCost
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
                    title: "Transaction sent",
                    description: txHash,
                    status: "info",
                    isClosable: true,
                });
            })
            .on("receipt", () => {
                toast({
                    title: "Transaction confirmed",
                    description: `Doggies breeded correctly! Hooray!`,
                    status: "success",
                    isClosable: true,
                });
            });

            oneDoggies.events
            .Birth()
            .on('data', function(event){
                setDoggieId(event.returnValues.doggieId);
                setDadIdMint(event.returnValues.dadId);
                setMomIdMint(event.returnValues.momId);
                setDnaMint(event.returnValues.dna);
                setDoggieOwner(event.returnValues.owner);
                setMintedName(event.returnValues.doggieName);
                onOpen();
                setLocalTimesBreededMom(parseInt(localTimesBreededMom) +1);
                setLocalTimesBreededDad(parseInt(localTimesBreededDad) +1);

            })
            .on("error", (error) => {
                toast({
                    title: "Breed failed",
                    description: error.message,
                    status: "error",
                    isClosable: true,
                })
            })
            
            setBreeding(false);
            
        }
    }

    if (!active) return <RequestAccess />;

    return (
        <Stack direction="column">
            <Center>
                <Heading
                    lineHeight={1.1}
                    fontWeight={600}
                    fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
                >
                    <Text as={"span"} color={"blue.400"}>
                        Breed your doggies ❤️
                    </Text>
                </Heading>
            </Center>
            <SimpleGrid columns={2} spacing={5}>
            <Center>
                <Heading
                    lineHeight={1.1}
                    fontWeight={600}
                    fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }}
                    spacing={10}
                >
                    <Text as={"span"} color={"blue.400"}>
                    Select the sire.
                    </Text>
                </Heading>
            </Center>
            <Center>
                <Heading
                    lineHeight={1.1}
                    fontWeight={600}
                    fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }}
                    spacing={10}
                >
                    <Text as={"span"} color={"blue.400"}>
                    Select the dame.
                    </Text>
                </Heading>
            </Center>
            <Center>
                <Select placeholder='Select the sire' width="50%" name="dadId" value={dadId} onChange={(e) => updateDad(e.target.value)}>
                    {doggies.map(({tokenId, doggieName, generation}) =>(
                        <option value={tokenId} key={tokenId}>ID: #{tokenId} Name: {doggieName} Gen: {generation}</option>
                    ))}
                </Select>
            </Center>
            <Center>
                <Select placeholder='Select the dame' width="50%" name="momId" value={momId} onChange={(e) => updateMom(e.target.value)}>
                    {doggies.map(({tokenId, doggieName, generation}) =>(
                        <option value={tokenId} key={tokenId}>ID: #{tokenId} Name: {doggieName} Gen: {generation}</option>
                    ))}
                </Select>
            </Center>
                {hasSelectedDad ? (
                    <Stack 
                        spacing={{ base: 8, md: 10 }}
                        py={{ base: 5 }}
                        direction={{ base: "column", md: "row" }}
                    >
                        <Stack>
                            <Box>
                                <DoggieCard 
                                    primaryColor={primaryColorDad} 
                                    secondaryColor={secondaryColorDad} 
                                    stomachColor={stomachColorDad} 
                                    backgroundColor={backgroundColorDad}
                                    locketColor={locketColorDad}
                                    beltColor={beltColorDad}
                                    dotsColor={dotsColorDad}
                                    animationType={animationTypeDad}
                                    secret={secretDad}
                                ></DoggieCard>
                            </Box>
                        </Stack>
                        <Stack spacing={5}>
                        <Heading>{nameDad}</Heading>
                        <Text fontWeight={600}>
                            Token ID:
                            <Tag ml={2} colorScheme="green">
                                {dadId}
                            </Tag>
                        </Text>
                        <Text fontWeight={600}>
                            Generation:
                            <Tag ml={2} colorScheme="green">
                                {generationDad}
                            </Tag>
                        </Text>
                        <Text fontWeight={600}>
                            Dad ID:
                            <Tag ml={2} colorScheme="green">
                                {dadIdDad}
                            </Tag>
                            </Text>
                            <Text fontWeight={600}>
                            Mom ID:
                            <Tag ml={2} colorScheme="green">
                                {momIdDad}
                            </Tag>
                        </Text>
                        <Text fontWeight={600}>
                            Birth time:
                            <Tag ml={2} colorScheme="green">
                                {convertDate(birthTimeDad)}
                            </Tag>
                        </Text>
                        <Text fontWeight={600}>
                            DNA:
                            <Tag ml={2} colorScheme="green">
                                {dnaDad}
                            </Tag>
                        </Text>
                        <Text fontWeight={600}>
                            Times Breeded:
                            <Tag ml={2} colorScheme="green">
                                {localTimesBreededDad}
                            </Tag>
                        </Text>
                        </Stack>
                    </Stack>
                    ) : (
                        <Text></Text>
                    )}
                    {hasSelectedMom ? (
                        <Stack 
                            spacing={{ base: 8, md: 10 }}
                            py={{ base: 5 }}
                            direction={{ base: "column", md: "row" }}
                        >
                            <Stack>
                                <Box>
                                    <DoggieCard 
                                        primaryColor={primaryColorMom} 
                                        secondaryColor={secondaryColorMom} 
                                        stomachColor={stomachColorMom} 
                                        backgroundColor={backgroundColorMom}
                                        locketColor={locketColorMom}
                                        beltColor={beltColorMom}
                                        dotsColor={dotsColorMom}
                                        animationType={animationTypeMom}
                                        secret={secretMom}
                                    ></DoggieCard>
                                </Box>
                            </Stack>
                            <Stack spacing={5}>
                            <Heading>{nameMom}</Heading>
                            <Text fontWeight={600}>
                                Token ID:
                                <Tag ml={2} colorScheme="green">
                                    {momId}
                                </Tag>
                            </Text>
                            <Text fontWeight={600}>
                                Generation:
                                <Tag ml={2} colorScheme="green">
                                    {generationMom}
                                </Tag>
                            </Text>
                            <Text fontWeight={600}>
                                Dad ID:
                                <Tag ml={2} colorScheme="green">
                                    {dadIdMom}
                                </Tag>
                                </Text>
                                <Text fontWeight={600}>
                                Mom ID:
                                <Tag ml={2} colorScheme="green">
                                    {momIdMom}
                                </Tag>
                            </Text>
                            <Text fontWeight={600}>
                                Birth time:
                                <Tag ml={2} colorScheme="green">
                                    {convertDate(birthTimeMom)}
                                </Tag>
                            </Text>
                            <Text fontWeight={600}>
                                DNA:
                                <Tag ml={2} colorScheme="green">
                                    {dnaMom}
                                </Tag>
                            </Text>
                            <Text fontWeight={600}>
                            Times Breeded:
                            <Tag ml={2} colorScheme="green">
                                {localTimesBreededMom}
                            </Tag>
                        </Text>
                            </Stack>
                        </Stack>
                    ) : (
                        <Text></Text>
                    )}
            </SimpleGrid>
            {hasSelectedMom && hasSelectedDad ? (
                <Center>
                    <Stack>
                        <Heading
                            lineHeight={1.1}
                            fontWeight={600}
                            fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }}
                            spacing={10}
                        >
                            <Text as={"span"} color={"blue.400"}>
                            Give your new doggie a name!
                            </Text>
                        </Heading>
                        <Text>Name: (you can change it later) </Text>
                        <ButtonGroup>
                            <Input placeholder={`How about "${suggestedName}"?`} value={newName} onChange={handleChange} width="100%"/>
                            <Button colorScheme='green' size="md" width="65%" justifyContent="flex-start" onClick={() => randomName()}>Random Name</Button>
                            <Button colorScheme='teal' size="md" width="85%" justifyContent="flex-start" onClick={() => randomSuggestion()}>Random Suggestion</Button>
                        </ButtonGroup>
                        <Text spacing={10}></Text>
                        <Center>
                            { loadingGetBreedCost ? (
                                <Text>Loading price...</Text>
                            ) : (
                                <Text fontWeight={600} placement='left'>Breed price: {library.utils.fromWei(breedCost)} ONE.</Text>
                            ) }
                        </Center>
                        <Center>
                            <Button colorScheme='green' size="md" width="70%" justifyContent="center" disabled={breeding} onClick={() => breed()}>Breed! 🐶❤️🐶</Button>
                        </Center>
                        
                    </Stack>
                </Center>
            ) : (
                <Text></Text>
            )}
        
        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Doggies successfully breeded!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Text fontWeight='bold' mb='1rem'>
                Your doggie was successfully minted with the following atributes: 
                </Text>
                <Text>
                Name: {mintedName}
                </Text>
                <Text>
                ID: {doggieId}
                </Text>
                <Text>
                Mom ID: {momIdMint}
                </Text>
                <Text>
                Dad ID: {dadIdMint}
                </Text>
                <Text>
                DNA: {dnaMint}
                </Text>
                <Text>
                Owner (you!): {doggieOwner}
                </Text>
                <Text fontWeight='bold' mb='1rem'>
                Congratulations! 🐶
                </Text>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>

        </Stack>
    );
}

export default Breed;