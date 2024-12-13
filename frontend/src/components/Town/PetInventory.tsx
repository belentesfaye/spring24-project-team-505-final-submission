import React, { useCallback, useEffect, useState } from 'react';
import { getItems, getUser, addUserItem } from '../../services/userService'; // Adjust the import path as necessary
import {
  Flex,
  Image,
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import useTownController from '../../hooks/useTownController';
import { ITEMS } from '../../types/items';

const PetInventory = () => {
  const coveyTownController = useTownController();
  const username = coveyTownController.userName;
  const [items, setItems] = useState<number[]>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const fetchItems = async () => {
    try {
      const user = await getUser(username);
      const id = user?._id.toString();
      if (id !== undefined && id != null) {
        const userItems = await getItems(id);
        if (userItems) {
          setItems(userItems);
        }
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems(); // Fetch items when component mounts
    const listener = () => {
      fetchItems(); // Fetch items when 'petsChanged' event is emitted
    };
    coveyTownController.addListener('petsChanged', listener);

    // Cleanup function to remove the listener when component unmounts
    return () => {
      coveyTownController.removeListener('petsChanged', listener);
    };
  }, [coveyTownController]);

  const handleWalkButtonClick = () => {
    // Handle walk button click logic here
    console.log('walk');
  };

  return (
    <Flex align='center'>
      <Box
        position='fixed'
        top='35px' // adjust as needed
        right='275' // adjust as needed
        w='200px'
        h='60px'
        bg='white'
        border='1px solid #ccc'
        borderRadius='5px'
        display='flex'
        justifyContent='center'
        alignItems='center'
        fontWeight='bold'
        cursor='pointer'
        onClick={() => {
          onOpen();
          coveyTownController.pause();
        }}>
        <Image src='/assets/pets.png' alt='Pets' boxSize='30px' mr='10px' />
        View inventory
      </Box>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          coveyTownController.unPause();
        }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pet Inventory</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Render inventory items here */}
            {items && items.length !== 0 ? (
              <Flex flexDirection='row' flexWrap='wrap'>
                {items.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      <Flex
                        flexDirection='column'
                        alignItems='center'
                        marginBottom='20px'
                        marginRight='20px'
                        borderRadius='10px'
                        style={{
                          cursor: 'pointer',
                          border: selectedItem === index ? '2px solid #4299E1' : '1px solid #ccc',
                        }}
                        onClick={() => setSelectedItem(index)}>
                        <Box>{ITEMS[item - 1].name}</Box>
                        <Image
                          src={ITEMS[item - 1].path}
                          alt={ITEMS[item - 1].name}
                          boxSize='45px'
                          height='60px'
                          margin='10px'
                        />
                        <Flex alignItems='center' justifyContent='space-between' width='100%'>
                          <Box marginLeft={3} marginRight={3}>
                            Speed:
                          </Box>
                          <Box marginRight={3}>{ITEMS[item - 1].speed}</Box>
                        </Flex>
                      </Flex>
                      <Button
                        color='white'
                        backgroundColor={selectedItem === null ? '#E2E8F0' : '#4299E1'}
                        onClick={handleWalkButtonClick}
                        disabled={selectedItem === null}
                        position='absolute'
                        bottom='10px'
                        right='10px'>
                        Walk
                      </Button>
                    </React.Fragment>
                  );
                })}
              </Flex>
            ) : (
              <Flex justifyContent='center' paddingBottom={30}>
                No items yet. Go to the pet shop to buy some!
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default PetInventory;
