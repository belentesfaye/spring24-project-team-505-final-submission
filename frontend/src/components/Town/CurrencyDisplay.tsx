import React, { useEffect, useState } from 'react';
import { getCoins, getUser, updateUserCoins } from '../../services/userService'; // Adjust the import path as necessary
import { Flex, Image, Box } from '@chakra-ui/react'; // Import Chakra UI components
import useTownController from '../../hooks/useTownController';

const CurrencyDisplay = () => {
  const coveyTownController = useTownController();
  const username = coveyTownController.userName;
  const [coins, setCoins] = useState(0);

  // // TODO: delete after demo
  useEffect(() => {
    // Make API call to update user's coins to 100 on first render
    const updateCoins = async () => {
      try {
        const user = await getUser(username);
        const id = user?._id.toString();
        if (id !== undefined && id != null) {
          const userCoins = await getCoins(id);
          if (!userCoins) {
            const newUser = await updateUserCoins(id, 100); // Call the service function to update user's coins to 100
            if (newUser) {
              setCoins(newUser?.playerstats.coins); // Update local state to reflect the change
            }
          } else {
            setCoins(userCoins);
          }
        }
      } catch (error) {
        console.error('Error updating coins:', error);
      }
    };

    updateCoins();
  }, []); // Empty dependency array to ensure this effect runs only once on mount

  const fetchCurrency = async () => {
    try {
      const user = await getUser(username);
      const id = user?._id.toString();
      if (id !== undefined && id != null) {
        const userCurrency = await getCoins(id); // Call the service function to get the user's currency
        if (userCurrency) {
          setCoins(userCurrency);
        } else {
          setCoins(0);
        }
      }
    } catch (error) {
      console.error('Error fetching currency:', error);
    }
  };

  coveyTownController.addListener('coinsChanged', () => {
    // Update the currency display when a user's currency changes (happens when game ends + after pet purchases)
    fetchCurrency();
  });

  return (
    <Flex align='center'>
      <Box
        position='fixed'
        bottom='50px' // adjust as needed
        left='40px' // adjust as needed
        // w='100px'
        h='45px'
        bg='white'
        border='1px solid #ccc'
        borderRadius='5px'
        display='flex'
        justifyContent='center'
        alignItems='center'
        fontWeight='bold'
        whiteSpace='nowrap' // prevent text from wrapping
        px='8px'>
        <Image src='/assets/coin.png' alt='Coin' boxSize='30px' mr='10px' />
        {coins !== 0 ? coins : 'Play games to win coins.'}
      </Box>
    </Flex>
  );
};

export default CurrencyDisplay;
