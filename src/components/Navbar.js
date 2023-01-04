import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import CustomConnect from "./CustomConnect";
import {
  useConnectModal,
  useAccountModal,
  useChainModal,
} from "@rainbow-me/rainbowkit";

function Navbar() {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();

  return (
      <Box sx={{ flexGrow: 1 }}>

     
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6"sx={{ flexGrow: 1 }}>
          Nolan Swap
        </Typography>

          {openConnectModal && (
            <Button sx={{ color: '#fff' }} onClick={openConnectModal} type="button">
              Connect
            </Button>
          )}

          {openAccountModal && (
            <Button sx={{ color: '#fff' }} onClick={openAccountModal} type="button">
              Account
            </Button>
          )}
      </Toolbar>
    </AppBar>
    </Box>
  );
}

export default Navbar;
