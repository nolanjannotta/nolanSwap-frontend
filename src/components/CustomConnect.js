import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styled from 'styled-components'


function CustomConnect() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <ButtonContainer>
            {(() => {
              if(chain) {

              
                if (chain.unsupported) {
                  return (
                    <button onClick={openChainModal} type="button">
                      Wrong network
                    </button>
                  );
                }
                
                return (
                  <ButtonContainer>
                    <Button
                      onClick={openChainModal}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      {chain.name}
                    </Button>

                    <Button onClick={openAccountModal} type="button">
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''}
                    </Button>
                  </ButtonContainer>
                );
              }
            })()}
            
          </ButtonContainer>
        );
      }}
    </ConnectButton.Custom>
  )
}

export default CustomConnect


const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    // background-color: blue;
    flex-direction: column;
    height: 100%;
    width: 100%;


`

const Button = styled.button`
    height: 40%;
    width: 50%;
    background-color: #c0c0c0;
    display: flex;
    justify-content: center;
    align-items: center;



`


