import React,{useState} from 'react'
import {SwapInput, Input} from "../styles"





const InitializePool = ({poolData, allowanceData}) => {

    const [swapAmount, setSwapAmount] = useState({
        tokenA: 0,
        tokenB: 0
    })


        return (
            <SwapInput>
                {poolData.token1Name}
                {allowanceData.tokenA == 0 && <button onClick={allowanceData.approveA}>allow all</button>}
                <Input type="number" name="name"   onChange={(event) => {setSwapAmount(prev => ({...prev, tokenA: event.target.value}))}} />
                {poolData.token2Name}
                {allowanceData.tokenB == 0 && <button onClick={allowanceData.approveB}>allow all</button>}
                <Input type="number" name="name"   onChange={(event) => {setSwapAmount(prev => ({...prev, tokenB: event.target.value}))}}/>
                {/* <button onClick={initialize}>initialize pool</button> */}
            </SwapInput>
        )

    }
    


export default InitializePool

