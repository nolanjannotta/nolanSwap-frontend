import React,{useState} from 'react'
import {SwapInput, Input} from "../styles"
import useInitialize from '../hooks/useInitialize'
import useAllowance from '../hooks/useAllowance'





const InitializePool = ({poolData, poolContract}) => {

    const {allowanceData, approveA, approveB} = useAllowance(poolData);
    console.log(allowanceData)
    const [initAmount, setInitAmount] = useState({
        tokenA: 0,
        tokenB: 0
    })

    const {initialize} = useInitialize(poolContract, initAmount)


        return (
            <SwapInput>
                {poolData.token1Name}
                {allowanceData.tokenA == 0 && <button onClick={approveA}>allow all</button>}
                <Input type="number" name="name"   onChange={(event) => {setInitAmount(prev => ({...prev, tokenA: event.target.value}))}} />
                {poolData.token2Name}
                {allowanceData.tokenB == 0 && <button onClick={approveB}>allow all</button>}
                <Input type="number" name="name"   onChange={(event) => {setInitAmount(prev => ({...prev, tokenB: event.target.value}))}}/>
                <button onClick={initialize}>initialize pool</button>
            </SwapInput>
        )

    }
    


export default InitializePool

