import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import {  providers } from "ethers"
import { Config, DAppProvider, Goerli, Mainnet } from '@usedapp/core';
import {MainPage} from './components/MainPage'

export const App = () => {


  const dAppconfig: Config = {
    readOnlyUrls: {
      //  [Mainnet.chainId]: getDefaultProvider('mainnet') as any,
      [Goerli.chainId]: new providers.AlchemyProvider('goerli',process.env.REACT_APP_GOERLI_KEY),
      [Mainnet.chainId]: new providers.AlchemyProvider('mainnet',process.env.REACT_APP_MAIN_KEY),

    },
    refresh: 'never',

  }

  return (

    <DAppProvider config={dAppconfig}>

    <ChakraProvider theme={theme}>
       <MainPage/>
    </ChakraProvider>
    </DAppProvider>
  )

}