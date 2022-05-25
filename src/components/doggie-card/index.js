import {
    Flex,
    Heading,
    Text,
    Box,
    Center
  } from "@chakra-ui/react";

const DoggieCard = ({}) => {

    return (
        <Box paddingLeft={59} paddingRight={59} borderWidth="1px" backgroundColor={"#D8BFD8"}>
            <div className="ears"></div>
            <div className="dog">
                <div className="body">
                  <div className="eyes"></div>
                  <div className="beard">
                    <div className="mouth">
                      <div className="tongue"></div>
                    </div>
                  </div>
                  <div className="belt">
                    <div className="locket"></div>
                    <div className="dot dot1"></div>
                    <div className="dot dot2"></div>
                    <div className="dot dot3"></div>
                    <div className="dot dot4"></div>
                    <div className="tag"></div>
                  </div>
                  <div className="stomach">
                  </div>
                  <div className="legs">
                    <div className="left"></div>
                    <div className="right"></div>
                  </div>
                </div>
                
              </div>
            <div className="tail"></div>
          </Box>
    )
}


export default DoggieCard;