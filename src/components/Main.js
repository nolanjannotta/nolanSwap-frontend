import React, {useState, useEffect} from 'react'
import styled from 'styled-components';
import CreatePair from './CreatePair';
import SelectPair from './SelectPair';
import ExampleTokens from './ExampleTokens';
import { useAccount, useContract, useProvider} from 'wagmi'
import { utils, constants } from "ethers";
import PoolFactoryAbi from "../ABI/PoolFactory"
import PoolABI from "../ABI/NSPool.json"
import CustomConnect from "./CustomConnect"
import useTokenPair from "../hooks/useTokenPair"
import {factory} from "../addresses"
import {isZeroAddress} from "../utils"
import useAllowance from '../hooks/useAllowance';
import usePool from '../hooks/usePool';
import useGetPoolData from '../hooks/useGetPoolData'
import Navbar from './Navbar';
import {Container, Box, Card, CardActions, CardContent, CssBaseline, Grid} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from '@mui/material/colors';


const theme = createTheme();


function Main() {

    const provider = useProvider();

    
    const poolFactory = useContract({
      addressOrName: factory,
      contractInterface: PoolFactoryAbi,
      signerOrProvider: provider
    });


    const allPoolData = useGetPoolData(poolFactory);

    const tokenPairContracts = useTokenPair(allPoolData.poolData.addressA, allPoolData.poolData.addressB)

    const allowanceData = useAllowance(allPoolData.poolData, allPoolData.getPool)

  return (
    <ThemeProvider theme={theme}>
    <Box bgcolor="#fbf2c4" >
      <CssBaseline/>
      <Navbar/>

      <Container align="center" minHeight="100%"  minWidth='100%'>      

        <ExampleTokens 
            poolFactory={poolFactory} 
            allPoolData={allPoolData}
            />       

             <Box display="flex" justifyContent="space-around">
              <CreatePair 
            allPoolData={allPoolData}
            tokenPairContracts={tokenPairContracts}
            allowanceData={allowanceData}
            />
            
              <SelectPair 
                allPoolData={allPoolData}
                tokenPairContracts={tokenPairContracts}
                allowanceData={allowanceData}
              /> 
          
          </Box> 

           

          </Container>
      </Box>
       </ThemeProvider>


  )
}

export default Main

const CardHolder = styled.div`
  display: flex;
  // flex-direction: column;
  justify-content: space-between;
  width: 65%;
`

const Background = styled.div`
background-color: #fbf2c4;
height: 100vh;
width: 100vw;
// display: flex;
// flex-direction: column;
// align-items: center;
// justify-content: center
`

const AccountDetails = styled.div`
position: absolute;
top: 0;
right: 0;

`
