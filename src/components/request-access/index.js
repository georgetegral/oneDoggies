import {
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
} from "@chakra-ui/react";

const RequestAccess = () => {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle mr={2}>Connect your wallet to access the app</AlertTitle>
      <CloseButton position="absolute" right="8px" top="8px" />
    </Alert>
  );
};

export default RequestAccess;
