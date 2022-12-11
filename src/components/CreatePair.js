import React from 'react'
import styled from 'styled-components'
import InitializePool from './InitializePool';
import ManageLiquidity from './ManageLiquidity';
import {utils} from "ethers";
import { isZeroAddress } from '../utils';

 


function CreatePair(props) {


  return (
    <Container>
        {(props.poolData.address == "" || isZeroAddress(props.poolData.address)) && "select or create a pair to manage liquidity"}
        
        {utils.isAddress(props.poolData.address) && !isZeroAddress(props.poolData.address) &&
        <SwapBox>
            {props.poolData.initialized 
                ? <ManageLiquidity 
                    poolData={props.poolData} 
                    pool={props.poolContract}
                    /> 

                : <InitializePool 
                    pool={props.poolContract} 
                    poolData={props.poolData} 
                    pairTokenA={props.pairTokenA} 
                    pairTokenB={props.pairTokenB}
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
