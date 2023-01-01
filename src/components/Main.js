import React from "react";
import CreatePair from "./CreatePair";
import SelectPair from "./SelectPair";
import ExampleTokens from "./ExampleTokens";
import { useContract, useProvider } from "wagmi";
import PoolFactoryAbi from "../ABI/PoolFactory";
import useTokenPair from "../hooks/useTokenPair";
import { factory } from "../addresses";
import useGetPoolData from "../hooks/useGetPoolData";
import Navbar from "./Navbar";
import {Box, CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PoolData from "./PoolData";

const theme = createTheme();

function Main() {
  const provider = useProvider();

  const poolFactory = useContract({
    addressOrName: factory,
    contractInterface: PoolFactoryAbi,
    signerOrProvider: provider,
  });

  const allPoolData = useGetPoolData(poolFactory);

  const tokenPairContracts = useTokenPair(
    allPoolData.poolData.addressA,
    allPoolData.poolData.addressB
  );

  return (
    <ThemeProvider theme={theme}>
      <Box bgcolor="#fbf2c4" height="100vh">
        <CssBaseline />
        <Navbar />
        <Box mt={3} display="flex" flexDirection="column" sx={{ height: 0.85 }}>
          <Box
            sx={{
              height: 1 / 2,
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <ExampleTokens
              poolFactory={poolFactory}
              allPoolData={allPoolData}
            />
            <PoolData poolFactory={poolFactory} allPoolData={allPoolData} />
          </Box>

          <Box
            sx={{
              height: 1/2,
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <CreatePair
              allPoolData={allPoolData}
              tokenPairContracts={tokenPairContracts}
            />
            <SelectPair
              allPoolData={allPoolData}
              tokenPairContracts={tokenPairContracts}
            />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Main;
