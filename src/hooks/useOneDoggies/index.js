import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import OneDoggiesArtifact from '../../config/web3/artifacts/abi';

const { address, abi } = OneDoggiesArtifact;

const useOneDoggies = () => {
    const { active, library, chainId } = useWeb3React();

    const oneDoggies = useMemo(() => {
        if(active) return new library.eth.Contract(abi, address[chainId]);
    }, [active, chainId, library?.eth?.Contract]);
    return oneDoggies;
};

export default useOneDoggies;