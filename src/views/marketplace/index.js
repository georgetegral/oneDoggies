import { useWeb3React } from "@web3-react/core";
import {
    Stack,
    Grid,
    InputGroup,
    InputLeftElement,
    Input,
    InputRightElement,
    Button,
    FormHelperText,
    FormControl,
    Box,
    Text,
    useToast,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    CloseButton,
    LinkBox,
    LinkOverlay
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import DoggieCard from "../../components/doggie-card";
import Loading from "../../components/loading";
import RequestAccess from "../../components/request-access";
import { useIsApprovedForAll } from "../../hooks/useOneDoggiesData";
import useOneDoggies from "../../hooks/useOneDoggies";
import useMarketplace from "../../hooks/useMarketplace";
import {useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
const Marketplace = () => {
    const { account, active } = useWeb3React();
    const oneDoggies = useOneDoggies();
    const marketplace = useMarketplace();
    const toast = useToast();
    
    //The user needs to have the contract approved to use the marketplace
    const { loading, approved, update } = useIsApprovedForAll({
        owner: account
    });
    const [approvingForAll, setApprovingForAll] = useState(false);
    
    const setApprovalForAll = () => {
        if(oneDoggies && marketplace != null){
            setApprovingForAll(true);
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

            setApprovingForAll(false);
        }
    }

    if (!active) return <RequestAccess />;

    return (
        <Stack>
       {approved ? (
            <Text>You are approved!</Text>
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