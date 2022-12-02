import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {useAccount, useContract, useProvider, useSigner} from 'wagmi'
import PoolAbi from "../ABI/NSPool"


function SwapContainer(props) {

const { address, isConnected } = useAccount();
const [poolAddr, setPoolAddr] = useState();

console.log(props.pool)

const provider = useProvider();
const { data: signer } = useSigner()

const pool = useContract({
    addressOrName: props.pool,
    contractInterface: PoolAbi,
    signerOrProvider: provider
});


const getTokenBalance = async() => {

}






  return (


    <button>Swap</button>


  )
}

export default SwapContainer

const Wrapper = styled.div`
    background-color: #fbf2c4;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;



`

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
const SwapInput = styled.div`
    display:flex;
    flex-direction: column;
    align-items: center;

`
const SwapBox = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
        



`

const Input = styled.input`


`