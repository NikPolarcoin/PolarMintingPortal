import { useEffect, useState } from "react"
import {
  Box,
  Text,
  
  VStack,

  Button,
  Center,
  Heading,
  HStack,
  Stat,
 
  StatLabel,
  StatNumber,
  Spinner,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useColorMode,
} from "@chakra-ui/react"

import { ethers } from "ethers"
import {  useEthers, useEtherBalance, useContractFunction } from '@usedapp/core';
import { info } from '../../utils/contractInfo'
import { ColorModeSwitcher } from "./ColorModeSwitcher";


export const MainPage = () => {

  const { activateBrowserWallet, account, library, chainId } = useEthers()

  const {colorMode } = useColorMode()

  const etherBalance = useEtherBalance(account)


  const [mintLoading, setMintLoading] = useState<boolean>(false)
  const [BurnLoading, setBurnLoading] = useState<boolean>(false)



  const [userUsdcbalance, setUserUsdcBalance] = useState<string>()
  const [userMyTokenbalance, setUserMyTokenBalance] = useState<string>()
  const [tokenPrice, setTokenPrice] = useState<string>()
  const [totalMinted, setTotalMinted] = useState<string>()
  const [contractUsdcbalance, setContractUsdcBalance] = useState<string>()
  const [allowance, setAllowance] = useState<string>()
  const [mintValue, setMintValue] = useState<string>('0')
  const [refetchAllowance, setRefetchAllowance] = useState(false)
  const [refetchContractData, setRefetchContractData] = useState(false)
  const [refetchUserData, setRefetchUserData] = useState(false)
  const [burnValue, setBurnValue] = useState<string>('0')
  const [myTokenContract, setMyTokenContract] = useState<ethers.Contract>()
  const [usdcContract, setUsdcContract] = useState<ethers.Contract>()

  
  const approve = useContractFunction(usdcContract, 'approve', { transactionName: 'approve' })
  const mint = useContractFunction(myTokenContract, 'mint', { transactionName: 'mint' })
  const burn = useContractFunction(myTokenContract, 'burn', { transactionName: 'burn' })



  useEffect(()=>{

    if(chainId){

      if (chainId === 5){
       setMyTokenContract(new ethers.Contract(info.myTokenaddressGoerli, info.abi, library))
       setUsdcContract(new ethers.Contract(info.usdcContractAddressGoerli, info.abi, library))

      }
      else if (chainId === 1){
        setMyTokenContract(new ethers.Contract(info.myTokenaddressMain, info.abi, library))
        setUsdcContract(new ethers.Contract(info.myTokenaddressMain, info.abi, library))
      }

    }


  },[chainId])



  useEffect(() => {

    if (account && myTokenContract && usdcContract) {

      const getUsdcBalance = async () => {
        try {


          const getbalance = await usdcContract.balanceOf(account)

          console.log('usdcbslance', (Number(getbalance.toString()) / 1000000).toFixed(6))
          setUserUsdcBalance((Number(getbalance.toString()) / 1000000).toFixed(6))
        }
        catch (e) {
          console.log(e)
        }


      }


      const getMyTokenBalance = async () => {
        try {


          const getbalance = await myTokenContract.balanceOf(account)

          console.log('myTokenBalance', (Number(getbalance.toString()) / 1000000).toFixed(6))
          setUserMyTokenBalance(getbalance.toString())
        }
        catch (e) {
          console.log(e)
        }


      }


      getUsdcBalance()
      getMyTokenBalance()

    }


  }, [account, refetchUserData,myTokenContract,usdcContract])




  useEffect(() => {


    if (library && myTokenContract) {

      const getTokenPrice = async () => {
        try {

          const getPrice = await myTokenContract.priceInUSDC()

          console.log('getPrice', (Number(getPrice.toString()) / 1000000).toFixed(6))
          setTokenPrice((Number(getPrice.toString()) / 1000000).toFixed(6))
        }
        catch (e) {
          console.log(e)
        }

      }


      getTokenPrice()
    }



  }, [library,myTokenContract])


  useEffect(() => {


    if (library && myTokenContract) {

      const getTokenTotalMinted = async () => {
        try {

          const totalMinted = await myTokenContract.totalSupply()

          console.log('totalMinted', totalMinted.toString())
          setTotalMinted(totalMinted.toString())
        }
        catch (e) {
          console.log(e)
        }

      }


      getTokenTotalMinted()
    }



  }, [library, refetchContractData,myTokenContract])


  useEffect(() => {


    if (library && usdcContract) {

      const getUsdcBalance = async () => {
        try {


          const getbalance = await usdcContract.balanceOf(info.myTokenaddressGoerli)

          console.log('usdcbslance', (Number(getbalance.toString()) / 1000000).toFixed(6))
          setContractUsdcBalance((Number(getbalance.toString()) / 1000000).toFixed(6))
        }
        catch (e) {
          console.log(e)
        }


      }


      getUsdcBalance()
    }



  }, [library, refetchContractData,usdcContract])




  useEffect(() => {


    if (library && account && usdcContract) {

      const getAllowance = async () => {

        try {

          const allowance = await usdcContract.allowance(account, info.myTokenaddressGoerli)

          console.log('allowance', (Number(allowance.toString()) / 1000000).toFixed(6))
          // setContractUsdcBalance((Number(getbalance.toString())/1000000).toFixed(6))
          setAllowance((Number(allowance.toString()) / 1000000).toFixed(6))
        }
        catch (e) {
          console.log(e)
        }


      }


      getAllowance()
    }



  }, [library, account, refetchAllowance,usdcContract])




  const onMintHandler = async () => {

    setMintLoading(true)

    if ((Number(tokenPrice) * Number(mintValue)) > Number(allowance)) {

      const output = await approve.send(info.myTokenaddressGoerli, Number(userUsdcbalance) * 1000000);

      console.log('output', output)
      setRefetchAllowance(!refetchAllowance)



    }
    else {


      const output = await mint.send(mintValue);

      console.log('output', output)
      setRefetchUserData(!refetchUserData)
      setRefetchContractData(!refetchContractData)

    }

    setMintLoading(false)

  }


  const onBurnHandler = async () => {

    setBurnLoading(true)
    const output = await burn.send(burnValue);

    console.log('output', output)
    setRefetchUserData(!refetchUserData)
    setRefetchContractData(!refetchContractData)

    setBurnLoading(false)

  }




  return (
    <Center >
      <VStack gap={5}>
        <HStack mt={10} alignItems={'end'}><Heading as={'h1'}>Custom Token Minting App</Heading> <ColorModeSwitcher /> </HStack>
       {chainId && <Text>Network : {  chainId === 5 ?'Goerli': chainId === 1 ? 'Main' : 'Not Supported'}</Text>}
        <Button onClick={() => activateBrowserWallet()} isDisabled={!!account}> {account ? 'Connected' : 'Connect Wallet'}</Button>
        {account && (chainId ===5 || chainId ===1)  &&
          <VStack gap={5}>

            <VStack bg={colorMode === 'light' ? 'gray.200' : 'gray.700'} rounded='lg' p={5} align={'start'} gap={5}>

              <HStack><Text >Account Connected: </Text> <Text fontWeight={'bold'}> {account}</Text></HStack>

              <HStack gap={5}>
                <Stat>
                  <StatLabel>ETH</StatLabel>
                  <StatNumber fontWeight={'bold'} fontSize={'sm'}>{etherBalance ? Number(ethers.utils.formatEther(etherBalance.toString())).toFixed(6) : <Spinner />}</StatNumber>
                </Stat>

                <Stat>
                  <StatLabel>USDC</StatLabel>
                  <StatNumber fontWeight={'bold'} fontSize={'sm'}>{userUsdcbalance && etherBalance ? userUsdcbalance : <Spinner />}</StatNumber>
                </Stat>

                <Stat>
                  <StatLabel>Token</StatLabel>
                  <StatNumber fontWeight={'bold'} fontSize={'sm'}>{userMyTokenbalance && etherBalance ? userMyTokenbalance : <Spinner />}</StatNumber>
                </Stat>

              </HStack>


            </VStack>


            <VStack align={'start'} gap={5} bg={colorMode === 'light' ? 'gray.200' : 'gray.700'} rounded='lg' p={5}>

              <HStack><Text >Token Contract: </Text> <Text fontWeight={'bold'}>{info.myTokenaddressGoerli}</Text></HStack>

              <HStack gap={8}>
                <Stat>
                  <StatLabel>Price</StatLabel>
                  <StatNumber fontWeight={'bold'} fontSize={'sm'}>{tokenPrice ? tokenPrice : <Spinner />}</StatNumber>
                </Stat>

                <Stat>
                  <StatLabel>USDC</StatLabel>
                  <StatNumber fontWeight={'bold'} fontSize={'sm'}>{contractUsdcbalance ? contractUsdcbalance : <Spinner />}</StatNumber>
                </Stat>

                <Stat>
                  <StatLabel >Supply</StatLabel>
                  <StatNumber fontWeight={'bold'} fontSize={'sm'}>{totalMinted ? totalMinted : <Spinner />}</StatNumber>
                </Stat>

              </HStack>


            </VStack>


            {userUsdcbalance !== undefined && tokenPrice !== undefined && allowance !== undefined && userMyTokenbalance &&

              <VStack gap={5}>
                <VStack>
                  <HStack>
                    <Box>
                      <NumberInput onChange={(e: any) => setMintValue(e)} defaultValue={0} precision={0} min={0} max={(Number(userUsdcbalance) / Number(tokenPrice))}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </Box>
                    <Button onClick={() => onMintHandler()} isDisabled={!Number(mintValue) || mintLoading} >{(Number(tokenPrice) * Number(mintValue)) <= Number(allowance) ? 'Mint' : 'Approve USDC'}{mintLoading && <Spinner size={'sm'} ml={2} />}</Button>
                  </HStack>

                  <HStack fontSize={'sm'}><Text >Allowance:</Text> <Text fontWeight={'bold'}>{allowance} USDC</Text> </HStack>

                </VStack>

                <VStack gap={0}>
                  <HStack>
                    <Box>
                      <NumberInput onChange={(e: any) => setBurnValue(e)} defaultValue={0} precision={0} min={0} max={Number(userMyTokenbalance)}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </Box>
                    <Button onClick={() => onBurnHandler()} isDisabled={!Number(burnValue) || BurnLoading} >Burn {BurnLoading && <Spinner size={'sm'} ml={2} />}</Button>
                  </HStack>
                  {Number(contractUsdcbalance) < Number(burnValue) * Number(tokenPrice) && <Text color={'red'}>The contract does not have sufficient USDC</Text>}

                  </VStack>

                </VStack>


            }

              </VStack>



            }
          </VStack>
    </Center>
  )

}

