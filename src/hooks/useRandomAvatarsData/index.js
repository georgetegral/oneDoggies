import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import useRandomAvatars from "../useRandomAvatars";

const getAvatarData = async ({ randomAvatars, tokenId }) => {
  const [
    tokenURI,
    owner,
  ] = await Promise.all([
    randomAvatars.methods.tokenURI(tokenId).call(),
    randomAvatars.methods.ownerOf(tokenId).call(),
  ]);

  const responseMetadata = await fetch(tokenURI);
  const metadata = await responseMetadata.json();

  return {
    tokenId,
    tokenURI,
    owner,
    ...metadata,
  };
};

// Plural
const useRandomAvatarsData = ({ owner = null} = {}) => {
  const [avatars, setAvatars] = useState([]);
  const { library } = useWeb3React();
  const [loading, setLoading] = useState(true);
  const randomAvatars = useRandomAvatars();

  const update = useCallback(async () => {
    if (randomAvatars) {
      setLoading(true);

      let tokenIds;

      if(!library.utils.isAddress(owner)) {

        const totalSupply = await randomAvatars.methods.totalSupply().call();
        tokenIds = new Array(Number(totalSupply)).fill().map((_, index) => index);

      } else {
        const balanceOf = await randomAvatars.methods.balanceOf(owner).call();
        
        const tokenIdsOfOwner = new Array(Number(balanceOf))
          .fill()
          .map((_,index) => 
            randomAvatars.methods.tokenOfOwnerByIndex(owner, index).call()
          );
        
        tokenIds = await Promise.all(tokenIdsOfOwner);
      }

      const avatarsPromise = tokenIds.map((tokenId) =>
        getAvatarData({ tokenId, randomAvatars })
      );

      const avatars = await Promise.all(avatarsPromise);

      setAvatars(avatars);
      setLoading(false);
    }
  }, [randomAvatars, owner, library?.utils]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    avatars,
    update,
  };
};

export { useRandomAvatarsData };
