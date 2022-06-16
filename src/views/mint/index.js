import {
    Stack,
    Flex,
    Heading,
    Text,
    Button,
    ButtonGroup,
    Box,
    useToast,
    useColorModeValue,
    Center,
    Badge,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
  } from "@chakra-ui/react";
  import DoggieCard from "../../components/doggie-card";
  import useOneDoggies from "../../hooks/useOneDoggies";
  import { useWeb3React } from "@web3-react/core";
  import { useCallback, useEffect, useState } from "react";
  
  const Mint = () => {
    const oneDoggies = useOneDoggies(); //Import from the library.eth.Contract method
    //console.log(oneDoggies); //To get the method names
    const { account } = useWeb3React();
    const toast = useToast();

    const [isMinting, setIsMinting] = useState(false);
    const [primaryColor, setPrimaryColor] = useState(10);
    const [secondaryColor, setSecondaryColor] = useState(11);
    const [stomachColor, setStomachColor] = useState(12);
    const [backgroundColor, setBackgroundColor] = useState(13);
    const [locketColor, setLocketColor] = useState(1);
    const [beltColor, setBeltColor] = useState(3);
    const [dotsColor, setDotsColor] = useState(23);
    const [animationType, setAnimationType] = useState(1);
    const [secret, setSecret] = useState(1);

    const sliderMinValue = 10;
    const sliderMaxValue = 99;
    const sliderSmallMinValue = 1;
    const sliderSmallMaxValue = 9;

    function randomDoggie(){
      setPrimaryColor(Math.floor(Math.random() * 90) + 10);
      setSecondaryColor(Math.floor(Math.random() * 90) + 10);
      setStomachColor(Math.floor(Math.random() * 90) + 10);
      setBackgroundColor(Math.floor(Math.random() * 90) + 10);
      setLocketColor(Math.floor(Math.random() * 2) + 1);
      setBeltColor(Math.floor(Math.random() * 7) + 3);
      setDotsColor(Math.floor(Math.random() * 90) + 10);
      setAnimationType(Math.floor(Math.random() * 3) + 1);
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
    }

    const mint = () => {
      var dna = primaryColor.toString() + secondaryColor.toString() + stomachColor.toString() + backgroundColor.toString() + locketColor.toString() + beltColor.toString() + dotsColor.toString() + animationType.toString() + secret.toString()
      setIsMinting(true);

      oneDoggies.methods
      .createDoggieGen0(dna)
      .send({
          from: account
          //value: 1e15
      })
      .on("transactionHash", (txHash) => {
          toast({
              title: "Transaction sent",
              description: "Tx hash: "+txHash,
              status: "info",
          })
      })
      .on("receipt", () => {
          toast({
              title: "Transaction confirmed",
              description: "Congrats! The transaction has been confirmed.",
              status: "success",
          })
      })
      .on("error", (error) => {
          toast({
              title: "Transaction failed",
              description: error.message,
              status: "error",
          })
      })

      oneDoggies.events
      .Birth().
      on('data', function(event){
        let doggieId = event.returnValues.doggieId
        let dadId = event.returnValues.dadId
        let momId = event.returnValues.momId
        let genes = event.returnValues.genes
        let owner = event.returnValues.owner
      })
      .on("error", (error) => {
        toast({
            title: "Mint failed",
            description: error.message,
            status: "error",
        })
    })

      setIsMinting(false);
  }

    return (
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
        
        <Stack w={"full"}>
        
          <Box paddingLeft={1} paddingRight={5}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }}
            >
              <Text as={"span"} color={"blue.400"}>
                Select your Doggie's attributes!
              </Text>
            </Heading>
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
    </Stack>
    );
  };
  
  export default Mint;
  