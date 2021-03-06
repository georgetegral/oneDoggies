import {
    Stack,
    Heading,
    Text,
    Button,
    ButtonGroup,
    Box,
    useToast,
    Center,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input,
    Flex,
    Spacer
  } from "@chakra-ui/react";
  import Loading from "../../components/loading";
  import DoggieCard from "../../components/doggie-card";
  import useOneDoggies from "../../hooks/useOneDoggies";
  import { useGetRemainingDoggies, useGetPrices } from "../../hooks/useOneDoggiesData";
  import { useWeb3React } from "@web3-react/core";
  import RequestAccess from "../../components/request-access";
  import dogNames from "dog-names";
  
  import { useState } from "react";
  
  const Mint = () => {
    const oneDoggies = useOneDoggies(); //Import from the library.eth.Contract method
    const { account, active, library } = useWeb3React();
    const toast = useToast();
    const { loading: loadingGetRemainingDoggies, remaining, update } = useGetRemainingDoggies();

    //Modal variables
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ doggieId, setDoggieId ] = useState(0);
    const [ momId, setMomId ] = useState(0);
    const [ dadId, setDadId ] = useState(0);
    const [ dnaMint, setDnaMint ] = useState(0);
    const [ doggieOwner, setDoggieOwner ] = useState(0);
    const [ mintedName, setMintedName ] = useState(0);
    const [ suggestedName, setSuggestedName ] = useState(dogNames.allRandom());
    const [ name, setName ] = useState("");
    const handleChange = (event) => setName(event.target.value)

    //Dog attributes
    const [isMinting, setIsMinting] = useState(false);
    const [primaryColor, setPrimaryColor] = useState(10);
    const [secondaryColor, setSecondaryColor] = useState(11);
    const [stomachColor, setStomachColor] = useState(12);
    const [backgroundColor, setBackgroundColor] = useState(13);
    const [locketColor, setLocketColor] = useState(1);
    const [beltColor, setBeltColor] = useState(3);
    const [dotsColor, setDotsColor] = useState(23);
    const [animationType, setAnimationType] = useState(1);
    const [secret, setSecret] = useState(Math.floor(Math.random() * 9) + 1);

    //Prices
    const {loading: loadingGetPrices, mintCost} = useGetPrices();

    const sliderMinValue = 10;
    const sliderMaxValue = 99;
    const sliderSmallMinValue = 1;
    const sliderSmallMaxValue = 9;

    function randomName(){
      setName(dogNames.allRandom());
    }
    function randomSuggestion(){
      setSuggestedName(dogNames.allRandom());
    }

    function randomDoggie(){
      setPrimaryColor(Math.floor(Math.random() * 90) + 10);
      setSecondaryColor(Math.floor(Math.random() * 90) + 10);
      setStomachColor(Math.floor(Math.random() * 90) + 10);
      setBackgroundColor(Math.floor(Math.random() * 90) + 10);
      setLocketColor(Math.floor(Math.random() * 2) + 1);
      setBeltColor(Math.floor(Math.random() * 7) + 3);
      setDotsColor(Math.floor(Math.random() * 90) + 10);
      setAnimationType(Math.floor(Math.random() * 3) + 1);
      setSecret(Math.floor(Math.random() * 9) + 1);
    }

    function baseDoggie(){
      setPrimaryColor(10);
      setSecondaryColor(11);
      setStomachColor(12);
      setBackgroundColor(13);
      setLocketColor(1);
      setBeltColor(3);
      setDotsColor(23);
      setAnimationType(1);
      setSecret(Math.floor(Math.random() * 9) + 1);
    }

    const mint = () => {
      var dna = primaryColor.toString() + secondaryColor.toString() + stomachColor.toString() + backgroundColor.toString() + locketColor.toString() + beltColor.toString() + dotsColor.toString() + animationType.toString() + secret.toString()
      setIsMinting(true);

      oneDoggies.methods
      .createDoggieGen0(dna,name)
      .send({
          from: account,
          value: mintCost
      })
      .on("transactionHash", (txHash) => {
          toast({
              title: "Transaction sent",
              description: "Tx hash: "+txHash,
              status: "info",
              isClosable: true,
          })
      })
      .on("receipt", () => {
          toast({
              title: "Transaction confirmed",
              description: "Congrats! The transaction has been confirmed.",
              status: "success",
              isClosable: true,
          })
      })
      .on("error", (error) => {
          toast({
              title: "Transaction failed",
              description: error.message,
              status: "error",
              isClosable: true,
          })
      })

      oneDoggies.events
      .Birth()
      .on('data', function(event){
        setDoggieId(event.returnValues.doggieId);
        setDadId(event.returnValues.dadId);
        setMomId(event.returnValues.momId);
        setDnaMint(event.returnValues.dna);
        setDoggieOwner(event.returnValues.owner);
        setMintedName(event.returnValues.doggieName);
        onOpen();
        update();

      })
      .on("error", (error) => {
        toast({
            title: "Mint failed",
            description: error.message,
            status: "error",
            isClosable: true,
        })
      })

      setIsMinting(false);
  }

  if (!active) return <RequestAccess />;
  if( loadingGetRemainingDoggies && loadingGetPrices ) return <Loading />

    return (
    <Stack direction="column">
      <Center>
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
        >
          <Text as={"span"} color={"blue.400"}>
          Mint your Doggie! ????
          </Text>
        </Heading>
      </Center>
      <Heading
        lineHeight={1.1}
        fontWeight={600}
        fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }}
        spacing={10}
      >
        <Text as={"span"} color={"blue.400"}>
          Select your Doggie's attributes!
        </Text>
      </Heading>
      <Text>Hurry! There are only {remaining} Gen0 doggies left!</Text>
      
     <Center borderWidth="2px">
        <Stack p="3" >
          <Box>
            <DoggieCard 
              primaryColor={primaryColor} 
              secondaryColor={secondaryColor} 
              stomachColor={stomachColor} 
              backgroundColor={backgroundColor}
              locketColor={locketColor}
              beltColor={beltColor}
              dotsColor={dotsColor}
              animationType={animationType}
              secret={secret}
            ></DoggieCard>
          </Box>
          
        </Stack>
        
        <Stack w={"full"} >
        
          <Box paddingLeft={1} paddingRight={5}>
            
            <Text>Name: (you can change it later) </Text>
            <ButtonGroup>
                <Input placeholder={`How about "${suggestedName}"?`} value={name} onChange={handleChange} width="100%"/>
                <Button colorScheme='green' size="md" width="65%" justifyContent="flex-start" onClick={() => randomName()}>Random Name</Button>
                <Button colorScheme='teal' size="md" width="85%" justifyContent="flex-start" onClick={() => randomSuggestion()}>Random Suggestion</Button>
            </ButtonGroup>
            <Text>Primary Color: {primaryColor}</Text>
            <Slider 
                aria-label='slider-ex-1' 
                defaultValue={10}
                min={sliderMinValue}
                max={sliderMaxValue}
                onChange={(val) => setPrimaryColor(val)}
                value={primaryColor}
            >
              <SliderTrack>
                  <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <Text>Secondary Color: {secondaryColor}</Text>
            <Slider 
                aria-label='slider-ex-1' 
                defaultValue={11}
                min={sliderMinValue}
                max={sliderMaxValue}
                onChange={(val) => setSecondaryColor(val)}
                value={secondaryColor}
            >
              <SliderTrack>
                  <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <Text>Stomach Color: {stomachColor}</Text>
            <Slider 
                aria-label='slider-ex-1' 
                defaultValue={12}
                min={sliderMinValue}
                max={sliderMaxValue}
                onChange={(val) => setStomachColor(val)}
                value={stomachColor}
            >
              <SliderTrack>
                  <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <Text>Background Color: {backgroundColor}</Text>
            <Slider 
                aria-label='slider-ex-1' 
                defaultValue={13}
                min={sliderMinValue}
                max={sliderMaxValue}
                onChange={(val) => setBackgroundColor(val)}
                value={backgroundColor}
            >
              <SliderTrack>
                  <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <Text>Locket Color: {locketColor}</Text>
            <Slider 
                aria-label='slider-ex-1' 
                defaultValue={1}
                min={1}
                max={2}
                onChange={(val) => setLocketColor(val)}
                value={locketColor}
            >
              <SliderTrack>
                  <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <Text>Belt Color: {beltColor}</Text>
            <Slider 
                aria-label='slider-ex-1' 
                defaultValue={3}
                min={3}
                max={sliderSmallMaxValue}
                onChange={(val) => setBeltColor(val)}
                value={beltColor}
            >
              <SliderTrack>
                  <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <Text>Dots Color: {dotsColor}</Text>
            <Slider 
                aria-label='slider-ex-1' 
                defaultValue={23}
                min={sliderMinValue}
                max={sliderMaxValue}
                onChange={(val) => setDotsColor(val)}
                value={dotsColor}
            >
              <SliderTrack>
                  <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <Text>Animation Type: {animationType}</Text>
            <Slider 
                aria-label='slider-ex-1' 
                defaultValue={1}
                min={sliderSmallMinValue}
                max={3}
                onChange={(val) => setAnimationType(val)}
                value={animationType}
            >
              <SliderTrack>
                  <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            
            <Box display='flex'>
              <ButtonGroup>
                <Button colorScheme='green' size="lg" onClick={() => randomDoggie()}>Random</Button>
                <Button colorScheme='teal' size="lg" onClick={() => baseDoggie()}>Base</Button>
              </ButtonGroup>
              
              <Text marginLeft={"auto"}>DNA: {primaryColor}{secondaryColor}{stomachColor}{backgroundColor}{locketColor}{beltColor}{dotsColor}{animationType}</Text>
              <Button colorScheme='blue' marginLeft={"auto"} size="lg" disabled={!oneDoggies} onClick={mint} isLoading={isMinting}>Mint!</Button>
            </Box>
            
          </Box>

        </Stack>

      </Center>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Doggie successfully minted!</ModalHeader>
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
              Mom ID: {momId}
            </Text>
            <Text>
              Dad ID: {dadId}
            </Text>
            <Text>
              DNA: {dnaMint}
            </Text>
            <Text>
              Owner (you!): {doggieOwner}
            </Text>
            <Text fontWeight='bold' mb='1rem'>
              Congratulations! ????
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex minWidth='max-content' alignItems='center' gap='2'>
      <Spacer />
      { loadingGetPrices ? (
        <Text>Loading price</Text>
      ) : (
        <Text fontWeight={600} placement='left'>Current mint price: {library.utils.fromWei(mintCost)} ONE.</Text>
      ) }
      </Flex>
    </Stack>
    );
  };
  
  export default Mint;
  