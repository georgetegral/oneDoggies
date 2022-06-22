import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import DoggieMarketplaceInterface from '../../config/web3/artifacts/marketplace';

const { address, abi } = DoggieMarketplaceInterface;

const useDoggieMarketplace = () => {
    const { active, library, chainId } = useWeb3React();

    const doggieMarketplace = useMemo(() => {
        if(active) return new library.eth.Contract(abi, address[chainId]);
    }, [active, chainId, library?.eth?.Contract]);
    return doggieMarketplace;
};

export default useDoggieMarketplace;