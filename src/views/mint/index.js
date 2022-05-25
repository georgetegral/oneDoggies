import {
    Stack,
    Flex,
    Heading,
    Text,
    Button,
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
  import { useWeb3React } from "@web3-react/core";
  import { useCallback, useEffect, useState } from "react";
  
  const Mint = () => {
    const [primaryColor, setPrimaryColor] = useState(10);
    const [secondaryColor, setSecondaryColor] = useState(10);
    const [stomachColor, setStomachColor] = useState(10);
    const [backgroundColor, setBackgroundColor] = useState(10);
    const [locketColor, setLocketColor] = useState(1);
    const [beltColor, setBeltColor] = useState(1);
    const [dotsColor, setDotsColor] = useState(1);
    const [animationType, setAnimationType] = useState(1);
    const [secret, setSecret] = useState(1);

    const sliderMinValue = 10;
    const sliderMaxValue = 99;
    const sliderSmallMinValue = 1;
    const sliderSmallMaxValue = 9;

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
            <DoggieCard></DoggieCard>
          </Box>
          <Text>DNA: {primaryColor}{secondaryColor}{stomachColor}{backgroundColor}{locketColor}{beltColor}{dotsColor}{animationType}</Text>
        </Stack>
        
        <Stack
          
          w={"full"}
        >
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }}
          >
            <Text as={"span"} color={"blue.400"}>
              Select your Doggie's attributes
            </Text>
          </Heading>
          
          <Box paddingRight={1}>
            <Text>Primary Color: {primaryColor}</Text>
            <Slider 
                aria-label='slider-ex-1' 
                defaultValue={10}
                min={sliderMinValue}
                max={sliderMaxValue}
                onChange={(val) => setPrimaryColor(val)}
            >
              <SliderTrack>
                  <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <Text>Secondary Color: {secondaryColor}</Text>
            <Slider 
                aria-label='slider-ex-1' 
                defaultValue={10}
                min={sliderMinValue}
                max={sliderMaxValue}
                onChange={(val) => setSecondaryColor(val)}
            >
              <SliderTrack>
                  <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <Text>Stomach Color: {stomachColor}</Text>
            <Slider 
                aria-label='slider-ex-1' 
                defaultValue={10}
                min={sliderMinValue}
                max={sliderMaxValue}
                onChange={(val) => setStomachColor(val)}
            >
              <SliderTrack>
                  <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <Text>Background Color: {backgroundColor}</Text>
            <Slider 
                aria-label='slider-ex-1' 
                defaultValue={10}
                min={sliderMinValue}
                max={sliderMaxValue}
                onChange={(val) => setBackgroundColor(val)}
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
                min={sliderSmallMinValue}
                max={sliderSmallMaxValue}
                onChange={(val) => setLocketColor(val)}
            >
              <SliderTrack>
                  <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <Text>Belt Color: {beltColor}</Text>
            <Slider 
                aria-label='slider-ex-1' 
                defaultValue={1}
                min={sliderSmallMinValue}
                max={sliderSmallMaxValue}
                onChange={(val) => setBeltColor(val)}
            >
              <SliderTrack>
                  <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <Text>Dots Color: {dotsColor}</Text>
            <Slider 
                aria-label='slider-ex-1' 
                defaultValue={1}
                min={sliderSmallMinValue}
                max={sliderSmallMaxValue}
                onChange={(val) => setDotsColor(val)}
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
                max={sliderSmallMaxValue}
                onChange={(val) => setAnimationType(val)}
            >
              <SliderTrack>
                  <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>

        </Stack>

      </Center>
    </Stack>
    );
  };
  
  export default Mint;
  