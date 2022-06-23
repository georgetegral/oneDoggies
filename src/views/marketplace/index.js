import { useWeb3React } from "@web3-react/core";
import {
    Stack,
    Grid,
    Button,
    Box,
    Text,
    Heading,
    useToast,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    LinkBox,
    LinkOverlay
} from "@chakra-ui/react";
import DoggieCard from "../../components/doggie-card";
import Loading from "../../components/loading";
import RequestAccess from "../../components/request-access";
import { useIsApprovedForAll, useGetAllTokensOnSale } from "../../hooks/useOneDoggiesData";
import useOneDoggies from "../../hooks/useOneDoggies";
import useMarketplace from "../../hooks/useMarketplace";

const Marketplace = () => {
    const { account, active } = useWeb3React();
    const oneDoggies = useOneDoggies();
    const marketplace = useMarketplace();
    const toast = useToast();
    
    //The user needs to have the contract approved to use the marketplace
    const { loading, approved, update } = useIsApprovedForAll({
        owner: account
    });
    const { loading: loadingDoggies, doggies, offers } = useGetAllTokensOnSale();
    const setApprovalForAll = () => {
        if(oneDoggies && marketplace != null){

            oneDoggies.methods.setApprovalForAll(marketplace._address, true).send({
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
                    description: `Marketplace approved! You are ready to trade doggies!`,
                    status: "success",
                    isClosable: true,
                });
            });

            oneDoggies.events
            .ApprovalForAll()
            .on('data', function(event){
                update();
            })
            .on("error", (error) => {
                toast({
                    title: "ApprovalForAll failed",
                    description: error.message,
                    status: "error",
                    isClosable: true,
                })
            })

        }
    }

    const getPrice = (id) =>{
        var price = 0;
        if (offers != null){
            var currentItem = offers.find(offer => offer._tokenId === id);
            price = currentItem.price;
        }
        return price;
    }

    if (loading || loadingDoggies) return <Loading />;
    if (!active) return <RequestAccess />;

    return (
        <Stack>
            <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
            >
                <Text as={"span"} color={"blue.400"}>
                Marketplace
                </Text>
          </Heading>
       {approved ? (
            <Stack>
                <Heading
                    lineHeight={1.1}
                    fontWeight={600}
                    fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }}
                    spacing={10}
                >
                    <Text as={"span"} color={"blue.400"}>
                        Look at all this amazing doggies for sale!
                    </Text>
                </Heading>
                <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
                {doggies.map(({tokenId, attributes, doggieName, generation}) =>(
                    <LinkBox key={tokenId}>
                        <LinkOverlay href={`#/doggies/${tokenId}`}>
                            <Box paddingLeft={5} paddingRight={5} borderWidth="1px">
                                <DoggieCard
                                    primaryColor={parseInt(attributes[0]['Primary Color'])} 
                                    secondaryColor={parseInt(attributes[0]['Secondary Color'])} 
                                    stomachColor={parseInt(attributes[0]['Stomach Color'])} 
                                    backgroundColor={parseInt(attributes[0]['Background Color'])}
                                    locketColor={parseInt(attributes[0]['Locket Color'])}
                                    beltColor={parseInt(attributes[0]['Belt Color'])}
                                    dotsColor={parseInt(attributes[0]['Dots Color'])}
                                    animationType={parseInt(attributes[0]['Animation Type'])}
                                    secret={parseInt(attributes[0]['Secret'])}
                                />
                                <Box display='flex'>
                                    <Text>ONEDoggie #{tokenId} 🐾</Text>
                                    <Text marginLeft={"auto"}>Gen: {generation}</Text>
                                </Box>
                                <Box display='flex'>
                                    <Text>Name: {doggieName}</Text>
                                    <Text marginLeft={"auto"}>Price: {getPrice(tokenId)} ONE</Text>
                                </Box>
                                
                            </Box>
                        </LinkOverlay>
                    </LinkBox>
                ))}
                </Grid>
            </Stack>
       ) : (
        <Alert
            status="warning"
            variant="subtle"
            flexDirection="column"
            justifyContent="center"
            textAlign="center"
            height="200px"
        >
        <AlertIcon size="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
            Approve the marketplace
        </AlertTitle>
        <AlertDescription maxWidth="sm">
            Before you use the marketplace, please approve it in your wallet.
        </AlertDescription>
        <Button colorScheme='orange' size="lg" onClick={setApprovalForAll} isLoading={loading}>Approve!</Button>
        </Alert>
       )};
       </Stack>
    );
};

export default Marketplace;