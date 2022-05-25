import {
    Flex,
    Heading,
    Text,
    Box,
    Center
} from "@chakra-ui/react";
import colors from "../../components/colors";

const DoggieCard = ({primaryColor, secondaryColor, stomachColor, backgroundColor, locketColor, beltColor, dotsColor, animationType, secret}) => {
    
    var earsStyle = {
        
    }

    var bodyStyle = {
        background: "#"+colors[primaryColor]
    }

    var beardStyle = {
        background: "#"+colors[secondaryColor]
    }

    var beardAfterStyle = {
        background: "#"+colors[secondaryColor]
    }

    var beltStyle = {
        background: "#"+colors[beltColor]
    }

    var locketStyle = {
        background: "#"+colors[locketColor]
    }

    var dotStyle = {
        background: "#"+colors[dotsColor]
    }

    var stomachStyle = {
        background: "#"+colors[stomachColor]
    }

    var tailStyle = {
        
    }

    return (
        <Box paddingLeft={59} paddingRight={59} borderWidth="1px" backgroundColor={"#"+colors[backgroundColor]}>
            <div className="ears" style={earsStyle}></div>
            <div className="dog">
                <div className="body" style={bodyStyle}>
                  <div className="eyes" style={stomachStyle}></div>
                  <div className="beard" style={beardStyle}>
                    <div className="beardafter" style={beardAfterStyle}></div>
                    <div className="mouth">
                      <div className="tongue"></div>
                    </div>
                  </div>
                  <div className="belt" style={beltStyle}>
                    <div className="locket" style={locketStyle}></div>
                    <div className="dot dot1" style={dotStyle}></div>
                    <div className="dot dot2" style={dotStyle}></div>
                    <div className="dot dot3" style={dotStyle}></div>
                    <div className="dot dot4" style={dotStyle}></div>
                    <div className="beltdotbefore" style={dotStyle}></div>
                    <div className="beltdotafter" style={dotStyle}></div>
                    <div className="tag"></div>
                  </div>
                  <div className="stomach" style={stomachStyle}>
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