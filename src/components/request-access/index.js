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
      <AlertTitle mr={2}>Conecta tu wallet para acceder a la app</AlertTitle>
      <CloseButton position="absolute" right="8px" top="8px" />
    </Alert>
  );
};

export default RequestAccess;
