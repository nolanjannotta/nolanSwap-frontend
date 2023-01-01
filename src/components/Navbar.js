import React from 'react'
import {AppBar, Toolbar, Typography} from '@mui/material';
import CustomConnect from "./CustomConnect"



function Navbar() {
  return (
    
        <AppBar position="relative" >
            <Toolbar variant="dense">
                <Typography variant="h6" align="center" >
                    Nolan Swap
                </Typography>
                    <CustomConnect></CustomConnect>
            </Toolbar>

        </AppBar>

  )
}

export default Navbar