import { useWeb3React } from "@web3-react/core";
import { 
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
  LinkBox,
  LinkOverlay
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import DoggieCard from "../../components/doggie-card";
import Loading from "../../components/loading";
import RequestAccess from "../../components/request-access";
import { useOneDoggiesData } from "../../hooks/useOneDoggiesData";
import {useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";

const Doggies = () =>{
    const {search} = useLocation();
    const [ address, setAddress ] = useState(
      new URLSearchParams(search).get("address")
    );
    const [submitted, setSubmitted ] = useState(true);
    const [validAddress, setValidAddress ] = useState(true);
    const navigate = useNavigate();
    const { active, library } = useWeb3React();
    const { doggies, loading } = useOneDoggiesData({
      owner: submitted && validAddress ? address : null
    });

    const handleAddressChange = ({target: {value}}) => {
        setAddress(value);
        setSubmitted(false);
        setValidAddress(false);
      }
    
      const submit = (event) => {
        event.preventDefault();
    
        if(address){
          const isValid = library.utils.isAddress(address);
          setValidAddress(isValid);
          setSubmitted(true);
          if (isValid) navigate(`/doggies?address=${address}`);
        } else {
          navigate("/doggies");
        }
      }
    
      if (!active) return <RequestAccess />;

      return (
        <>
          <form onSubmit={submit}>
            <FormControl>
              <InputGroup mb={3}>
                <InputLeftElement 
                pointerEvents="none" 
                children={<SearchIcon color="gray.300" />}
                />
    
                <Input 
                  isInvalid={false}
                  value={address ?? ''}
                  onChange={handleAddressChange}
                  placeholder="Search by address"
                />
    
                <InputRightElement width="5.5rem" >
                  <Button type="submit" h="1.75rem" size="sm">
                    Search 
                  </Button>
                </InputRightElement>
              </InputGroup>
              { submitted && !validAddress && (
                <FormHelperText>Invalid address</FormHelperText>
              )}
            </FormControl>
          </form>
          {loading ? (
            <Loading />
          ) : (
            <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
              {doggies.map(({tokenId, attributes, dna, generation}) =>(
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
                                <Text>ONEDoggie #{tokenId}</Text>
                                <Text marginLeft={"auto"}>Gen: {generation}</Text>
                            </Box>
                            <Text>DNA: {dna} 🐾</Text>
                        </Box>
                    </LinkOverlay>
                </LinkBox>
              ))}
            </Grid>
          )}
        </>
      );
    };

export default Doggies;
