import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import useOneDoggies from "../useOneDoggies";
import useMarketplace from '../useMarketplace';

const getDoggieData = async ({ oneDoggies, tokenId }) => {
    const [
        tokenURI,
        doggieData,
        owner
    ] = await Promise.all([
      oneDoggies.methods.tokenURI(tokenId).call(),
      oneDoggies.methods.getDoggie(tokenId).call(),
      oneDoggies.methods.ownerOf(tokenId).call()
    ]);

    const responseMetadata = await fetch(tokenURI);
    const metadata = await responseMetadata.json();
    
    const dna = doggieData.dna;
    const birthTime = doggieData.birthTime;
    const momId = doggieData.momId;
    const dadId = doggieData.dadId;
    const generation = doggieData.generation;
    const doggieName = doggieData.doggieName;

    return {
        tokenId,
        dna,
        birthTime,
        momId,
        dadId,
        generation,
        doggieName,
        owner,
        ...metadata
    }
}

//Plural
const useOneDoggiesData = ({ owner = null} = {}) => {
    const [doggies, setDoggies] = useState([]);
    const { library } = useWeb3React();
    const [loading, setLoading] = useState(true);
    const oneDoggies = useOneDoggies();
    const update = useCallback(async () => {
        if(oneDoggies){
            setLoading(true);

            let tokenIds;

            if(!library.utils.isAddress(owner)) {

                const totalSupply = await oneDoggies.methods.totalSupply().call();
                tokenIds = new Array(Number(totalSupply)).fill().map((_, index) => index);
                //Remove doggie #0
                tokenIds.shift();

            } else {
                const balanceOf = await oneDoggies.methods.balanceOf(owner).call();
                
                const tokenIdsOfOwner = new Array(Number(balanceOf))
                    .fill()
                    .map((_,index) => 
                    oneDoggies.methods.tokenOfOwnerByIndex(owner, index).call()
                    );
                
                tokenIds = await Promise.all(tokenIdsOfOwner);
            }
    
                const doggiesPromise = tokenIds.map((tokenId) =>
                getDoggieData({ tokenId, oneDoggies })
            );
    
                const doggies = await Promise.all(doggiesPromise);
        
                setDoggies(doggies);
                setLoading(false);

        }
    }, [oneDoggies, owner, library?.utils]);
    
    useEffect(() => {
        update();
    }, [update]);

    return {
        loading,
        doggies,
        update
    };
}

//Individual
const useOneDoggieData = (tokenId = null) => {
    const [doggie, setDoggie] = useState({});
    const [loading, setLoading] = useState(true);
    const oneDoggies = useOneDoggies();
  
    const update = useCallback(async () => {
      if (oneDoggies && tokenId != null) {
        setLoading(true);
  
        const toSet = await getDoggieData({ tokenId, oneDoggies });
        setDoggie(toSet);
  
        setLoading(false);
      }
    }, [oneDoggies, tokenId]);
  
    useEffect(() => {
      update();
    }, [update]);

    return {
      loading,
      doggie,
      update,
    };
};

//Give approval to Marketplace
const useIsApprovedForAll = ({ owner = null} = {}) => {
    const [approved, setApproved] = useState({});
    const [loading, setLoading] = useState(true);
    const oneDoggies = useOneDoggies();
    const marketplace = useMarketplace();

    const update = useCallback( async () => {
        if(oneDoggies && owner && marketplace != null){
            setLoading(true);
            const isApproved = await oneDoggies.methods.isApprovedForAll(owner, marketplace._address).call();

            setApproved(isApproved);

            setLoading(false);
        }
    }, [oneDoggies, marketplace, owner]);

    useEffect(() => {
        update();
      }, [update]);

    return { loading, approved, update };
};

//Get all tokens on sale on the marketplace
const useGetAllTokensOnSale = () => {
    const [doggies, setDoggies] = useState([]);
    const [loading, setLoading] = useState(true);
    const oneDoggies = useOneDoggies();
    const marketplace = useMarketplace();

    const update = useCallback(async () => {
        if(oneDoggies && marketplace != null){
            setLoading(true);
            let tokenIds;

            const tokensOnSale = await marketplace.methods.getAllTokenOnSale().call();
            tokenIds = new Array(Number(tokensOnSale)).fill().map((_, index) => index);

            const doggiesPromise = tokenIds.map((tokenId) =>
                getDoggieData({ tokenId, oneDoggies })
            );
    
            const doggies = await Promise.all(doggiesPromise);
    
            setDoggies(doggies);
            setLoading(false);
        }
    }, [oneDoggies, marketplace]);

    useEffect(() => {
        update();
    }, [update]);

    console.log(doggies);
    return {
        loading,
        doggies,
        update
    };
}

export {useOneDoggiesData, useOneDoggieData, useIsApprovedForAll, useGetAllTokensOnSale };