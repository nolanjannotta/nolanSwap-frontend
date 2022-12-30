import React from 'react'
import {Box, AppBar, Toolbar, IconButton, Typography} from '@mui/material';
import CustomConnect from "./CustomConnect"



function Navbar() {
  return (
    
        <AppBar position="relative">
            <Toolbar>
                <Typography variant="h6" align="center" >
                    Nolan Swap
                </Typography>
                    <CustomConnect></CustomConnect>
            </Toolbar>

        </AppBar>

  )
}

export default Navbar