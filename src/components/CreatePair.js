import React from 'react'
import styled from 'styled-components'
import InitializePool from './InitializePool';
import ManageLiquidity from './ManageLiquidity';
import {utils} from "ethers";
import { isZeroAddress } from '../utils';

 


function CreatePair({poolData,poolContract,allowanceData}) {


  return (
    <Container>
        {(poolData.address == "" || isZeroAddress(poolData.address)) && "select or create a pair to manage liquidity"}
        
        {utils.isAddress(poolData.address) && !isZeroAddress(poolData.address) &&
        <SwapBox>
            {poolData.initialized 
                ? <ManageLiquidity 
                    poolData={poolData} 
                    pool={poolContract}
                    allowanceData={allowanceData}
                    /> 

                : <InitializePool 
                    poolData={poolData} 
                    allowanceData={allowanceData}
                    />}

        </SwapBox>}

    </Container>
  )
}

export default CreatePair


const Container = styled.div`
    background-color: #74a892;
    width: 30vw;
    height: 30vh;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    border: 2px solid #008585;
    box-shadow: 8px 8px 8px #615e4c;

`
const SwapBox = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
`
