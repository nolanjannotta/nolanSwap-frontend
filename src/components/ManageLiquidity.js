import React, {useState} from 'react'
import {SwapInput,Input} from "../styles"
import useAllowance from '../hooks/useAllowance';
import {useSigner} from 'wagmi'
import useManageLiquidity from '../hooks/useManageLiquidity';




const ManageLiquidity = ({poolData, pool, getAllowance, allowances}) => {
    const {allowanceData, approveA, approveB} = useAllowance(poolData);

    const {addLiquidity, removeLiquidity, updateLiquidityParams, liquidityParams, setLiquidityParams} = useManageLiquidity(pool,poolData)
    console.log(liquidityParams)
    const [addOrRemove, setAddOrRemove] = useState(true); // true == add, false == remove
    const [reviewTx, setReviewTx] = useState(true)

    const flipTokens = () => {
        setLiquidityParams(prev => ({
            ...prev,
            addressIn: prev.address2In, 
            nameIn: prev.name2In,
            amountIn: 0,
            address2In: prev.addressIn,
            name2In: prev.nameIn,
            amount2In: 0,
    
    
        
        }))
    
    }

    
    if(addOrRemove) {
            return(
                reviewTx ?            
                <>            
                <button onClick={() => {setAddOrRemove(prev => !prev)}}>add/remove liquidity</button>
                    <SwapInput>
                        <span> remove liquidity</span>

                        <Input type="number" name="name" placeholder="amount"  onChange={(event) => {setLiquidityParams( prev => ({...prev, removeAmount: event.target.value}))}} />
                    </SwapInput>
                    <button onClick={() => setReviewTx(prev => !prev)}>review operation</button>

                </>
            :
            <>
            <SwapInput>
             removing {liquidityParams.removeAmount} lp tokens
                <button onClick={removeLiquidity}>submit</button>
             </SwapInput>
            <button onClick={() => setReviewTx(prev => !prev)}>back</button>

            </>
            )}
    else {
        return(        
            reviewTx ?
            <>
                <button onClick={() => {setAddOrRemove(prev => !prev)}}>add/remove liquidity</button>
        
                <SwapInput>
                    <span>
                    add liquidity:
                    </span>
                            {liquidityParams.nameIn}:
                            <Input type="number" name="name" value={liquidityParams.amountIn} onChange={(event)=> {setLiquidityParams( prev => ({...prev, amountIn: event.target.value}))}} />
                            <button onClick={updateLiquidityParams}>calculate</button>
                            <button onClick={flipTokens}>flip</button>
                            {liquidityParams.name2In}:&nbsp; 
                            {liquidityParams.amount2In} 
                            {/* <Input type="number" name="name" value={addLiquidityTokensIn.amount2In} onChange={(event)=> {setAddLiquidityTokensIn( prev => ({...prev, nameIn: props.tokenNames.tokenB, name2In:props.tokenNames.tokenA, amount2In: event.target.value, addressIn: props.pairTokenA.address, address2In: props.pairTokenB.address}))}}/> */}
        
                </SwapInput>
                <button onClick={() => setReviewTx(prev => !prev)}>review operation</button>
            </>
            : 
            <>
            <SwapInput>
                liquidity to add:
                <div>
                {liquidityParams.nameIn} - {liquidityParams.amountIn}

                </div>
                <div>
                {liquidityParams.name2In} - {liquidityParams.amount2In}   
                </div>
                <button onClick={addLiquidity}>submit</button>

            
            </SwapInput>
            <button onClick={() => setReviewTx(prev => !prev)}>back</button>

            </>
        )}
    
}

export default ManageLiquidity

