import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import RandomAvatarsArtifact from '../../config/web3/artifacts/abi';

const { address, abi } = RandomAvatarsArtifact;

const useRandomAvatars = () => {
    const { active, library, chainId } = useWeb3React();

    const randomAvatars = useMemo(() => {
        if(active) return new library.eth.Contract(abi, address[chainId]);
    }, [active, chainId, library?.eth?.Contract]);
    return randomAvatars;
};

export default useRandomAvatars;