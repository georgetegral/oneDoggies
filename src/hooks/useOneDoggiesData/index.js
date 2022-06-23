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

const getOfferData = async ({ marketplace, tokenId }) => {
    const offerData = await marketplace.methods.getOffer(tokenId).call();

    const seller = offerData.seller;
    const price = offerData.price;
    const index = offerData.index;
    const _tokenId = offerData.tokenId;
    const active = offerData.active;

    return {seller, price, index, _tokenId, active}
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
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const oneDoggies = useOneDoggies();
    const marketplace = useMarketplace();

    const update = useCallback(async () => {
        if(oneDoggies && marketplace != null){
            setLoading(true);
            
            var tokensOnSale = await marketplace.methods.getAllTokenOnSale().call();
            //Remove inactive offers
            tokensOnSale = tokensOnSale.filter(function(val) { return val !== '0' });

            const doggiesPromise = tokensOnSale.map((tokenId) =>
                getDoggieData({ tokenId, oneDoggies })
            );

            const offersPromise = tokensOnSale.map((tokenId) =>
                getOfferData({ tokenId, marketplace})
            );
    
            const doggies = await Promise.all(doggiesPromise);
            const offersData = await Promise.all(offersPromise);
            setDoggies(doggies);
            setOffers(offersData);
            setLoading(false);
        }
    }, [oneDoggies, marketplace]);

    useEffect(() => {
        update();
    }, [update]);

    return {
        loading,
        doggies,
        offers,
        update
    };
}

//Get offer of individual doggie
const useGetOffer = (tokenId = null) => {
    const [offer, setOffer] = useState();
    const [loading, setLoading] = useState(true);
    const marketplace = useMarketplace();

    const update = useCallback(async () => {
        if(tokenId && marketplace != null){
            setLoading(true);

            const getOffer = await getOfferData({ marketplace, tokenId });

            setOffer(getOffer);
            setLoading(false);
        }
    }, [marketplace, tokenId]);

    useEffect(() => {
        update();
    }, [update]);

    return {
        loading,
        offer,
        update
    };
}

//Get remaining Gen0 doggies
const useGetRemainingDoggies = () => {
    const [remaining, setRemaining] = useState(0);
    const [loading, setLoading] = useState(true);
    const oneDoggies = useOneDoggies();

    const update = useCallback(async () => {
        if(oneDoggies != null){
            setLoading(true);
            const totalSupply = await oneDoggies.methods.totalSupply().call();
            const maxSupply = await oneDoggies.methods.CREATION_LIMIT_GEN0().call();
            setRemaining(maxSupply - totalSupply);
            setLoading(false);
        }
    }, [oneDoggies]);

    useEffect(() => {
        update();
    }, [update]);

    return {
        loading,
        remaining,
        update
    };
}

export {useOneDoggiesData, useOneDoggieData, useIsApprovedForAll, useGetAllTokensOnSale, useGetOffer, useGetRemainingDoggies };