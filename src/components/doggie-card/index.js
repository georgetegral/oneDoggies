import {Box} from "@chakra-ui/react";
import colors from "../../components/colors";

const DoggieCard = ({primaryColor, secondaryColor, stomachColor, backgroundColor, locketColor, beltColor, dotsColor, animationType, secret}) => {
    
    var leftEarStyle = {
        background: "#"+colors[secondaryColor]
    }

    var rightEarStyle = {
        background: "#"+colors[secondaryColor],
        border: "10px solid #"+colors[primaryColor]
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

    if (animationType === 1 || animationType === 3){
        var tongueStyle = {
            WebkitAnimation: "grow 0.1s infinite alternate",
              animation: "grow 0.1s infinite alternate"
        }
    }
    else {
        tongueStyle = {
            WebkitAnimation: "grow 0s infinite alternate",
              animation: "grow 0s infinite alternate"
        }
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

    var tagStyle = {
        borderLeft: "5px solid #"+colors[beltColor],
        borderBottom: "5px solid #"+colors[beltColor]
    }

    if (animationType === 1 || animationType === 2){
        var tailStyle = {
            background: "#"+colors[primaryColor],
            WebkitAnimation: "shake 0.08s infinite alternate",
              animation: "shake 0.08s infinite alternate"
        }
    }
    else {
        tailStyle = {
            background: "#"+colors[primaryColor],
            WebkitAnimation: "shake 0s infinite alternate",
              animation: "shake 0s infinite alternate"
        }
    }
    
    var legBackStyle = {
        background: "#"+colors[secondaryColor]
    }

    var legFrontStyle = {
        background: "#"+colors[primaryColor]
    }

    return (
        <Box paddingLeft={59} paddingRight={59} borderWidth="1px" backgroundColor={"#"+colors[backgroundColor]}>
            <div className="leftear" style={leftEarStyle}></div>
            <div className="rightear" style={rightEarStyle}></div>
            <div className="dog">
                <div className="body" style={bodyStyle}>
                  <div className="eyes" style={stomachStyle}></div>
                  <div className="beard" style={beardStyle}>
                    <div className="beardafter" style={beardAfterStyle}></div>
                    <div className="mouth">
                      <div className="tongue" style={tongueStyle}></div>
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
                    <div className="tag" style={tagStyle}></div>
                  </div>
                  <div className="stomach" style={stomachStyle}>
                  </div>
                  <div className="upperleftleg" style={legBackStyle}></div>
                  <div className="backleftleg" style={legBackStyle}></div>
                  <div className="upperrightleg" style={legBackStyle}></div>
                  <div className="backrightleg" style={legBackStyle}></div>
                  <div className="frontleftleg" style={legFrontStyle}></div>
                  <div className="frontrightleg" style={legFrontStyle}></div>
                </div>
                
              </div>
            <div className="tail" style={tailStyle}></div>
          </Box>
    )
}


export default DoggieCard;