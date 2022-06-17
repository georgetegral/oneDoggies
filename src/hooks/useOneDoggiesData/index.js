import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import useOneDoggies from "../useOneDoggies";

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

    return {
        tokenId,
        tokenURI,
        dna,
        birthTime,
        momId,
        dadId,
        generation,
        owner,
        ...metadata
    }
}

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

export { useOneDoggiesData };