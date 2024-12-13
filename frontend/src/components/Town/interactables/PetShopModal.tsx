import React, { useCallback, useEffect, useState } from 'react';
import { useInteractable } from '../../../classes/TownController';
import useTownController from '../../../hooks/useTownController';
import {
  getUser,
  addUserItem,
  deleteUserItem,
  updateUserCoins,
  getCoins,
} from '../../../services/userService';
import { ITEMS } from '../../../types/items';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Image,
  Box,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { Item } from '../../../types/CoveyTownSocket';

type ItemProps = {
  item: Item;
  index: number;
  selectedItem: number | null;
  setItem: (index: number | null) => void;
  onClick: () => void;
  closeModal: () => void;
  toast: ReturnType<typeof useToast>;
};

function CoinImage() {
  return <Image src={'assets/coin.png'} alt={'Coin'} boxSize='22px' marginLeft={3} />;
}

// Component to display an item for sale
function SaleItem({ item, index, selectedItem, setItem, onClick, closeModal, toast }: ItemProps) {
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
          border: selectedItem === item.id - 1 ? '2px solid #4299E1' : '1px solid #ccc',
        }}
        onClick={() => {
          setItem(item.id - 1);
        }}>
        <Box>{item.name}</Box>
        <Image src={item.path} alt={item.name} boxSize='45px' height='60px' margin='10px' />
        <Flex alignItems='center' justifyContent='space-between' width='100%'>
          <Box marginLeft={3}>Refund:</Box>
          <Flex alignItems='center'>
            <CoinImage />
            <Box marginRight={3}>{item.value / 10}</Box>
          </Flex>
        </Flex>
      </Flex>
      <Button
        color='white'
        backgroundColor={selectedItem === null ? '#E2E8F0' : '#4299E1'}
        disabled={selectedItem === null}
        position='absolute'
        bottom='10px'
        right='10px'
        onClick={() => {
          onClick();
          closeModal();
          toast({
            title: 'Sold pet',
            status: 'success',
          });
        }}>
        Sell
      </Button>
    </React.Fragment>
  );
}

// Component to display an item for purchase
function PurchaseItem({ item, index, selectedItem, setItem, onClick, closeModal }: ItemProps) {
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
        onClick={() => {
          setItem(item.id - 1);
        }}>
        <Box>{item.name}</Box>
        <Image src={item.path} alt={item.name} boxSize='45px' height='60px' margin='10px' />
        <Flex alignItems='center' justifyContent='space-between' width='100%'>
          <Box marginLeft={3}>Cost:</Box>
          <Flex alignItems='center'>
            <CoinImage />
            <Box marginRight={3}>{item.value}</Box>
          </Flex>
        </Flex>
        <Flex alignItems='center' justifyContent='space-between' width='100%'>
          <Box marginLeft={3}>Speed:</Box>
          <Box marginRight={3}>{item.speed}</Box>
        </Flex>
      </Flex>
      <Button
        color='white'
        backgroundColor={selectedItem === null ? '#E2E8F0' : '#4299E1'}
        disabled={selectedItem === null}
        position='absolute'
        bottom='10px'
        right='10px'
        onClick={() => {
          onClick();
          closeModal();
        }}>
        Purchase
      </Button>
    </React.Fragment>
  );
}

export default function PetShopModal(): JSX.Element {
  const coveyTownController = useTownController();
  const petShop = useInteractable('petShopArea');

  const [selectedItemForSale, setSelectedItemForSale] = useState<number | null>(null);
  const [selectedItemForPurchase, setSelectedItemForPurchase] = useState<number | null>(null);
  const username = coveyTownController.userName;

  const toast = useToast();

  const getUserId = async () => {
    const user = await getUser(username);
    if (user) {
      return user._id;
    }
  };

  const setItemForSale = (index: number | null) => {
    setSelectedItemForSale(index);
  };

  const setItemForPurchase = (index: number | null) => {
    setSelectedItemForPurchase(index);
  };

  const purchase = async () => {
    const userId = await getUserId();
    if (userId && selectedItemForPurchase !== null) {
      const itemPrice = ITEMS[selectedItemForPurchase].value;
      const coins = await getCoins(userId);
      if (coins !== undefined && coins >= itemPrice) {
        await addUserItem(userId, selectedItemForPurchase + 1);
        await updateUserCoins(userId, coins - itemPrice);
        coveyTownController.emitPetsChanged();
        coveyTownController.emitCoinsChanged();
        toast({
          title: 'Purchased pet',
          status: 'success',
        });
      } else {
        toast({
          title: 'Insufficient coins',
          description: 'You do not have enough coins to purchase this pet.',
          status: 'error',
          duration: 3000, // Adjust the duration as needed
          isClosable: true,
        });
      }
    }
  };

  const sell = async () => {
    const userId = await getUserId();
    if (userId && selectedItemForSale !== null) {
      await deleteUserItem(userId, selectedItemForSale + 1);
      const coins = await getCoins(userId);
      if (coins) {
        await updateUserCoins(userId, coins + ITEMS[selectedItemForSale].value / 10);
      } else {
        await updateUserCoins(userId, 0 + ITEMS[selectedItemForSale].value / 10);
      }
    }
    coveyTownController.emitPetsChanged();
    coveyTownController.emitCoinsChanged();
  };

  const [items, setItems] = useState<number[]>();

  const isOpen = petShop !== undefined;

  useEffect(() => {
    if (petShop) {
      coveyTownController.pause();
    } else {
      coveyTownController.unPause();
    }
    const updateItems = async () => {
      try {
        const user = await getUser(username);
        if (user !== undefined && user != null) {
          const pets = user.playerstats.items;
          setItems(pets);
        }
      } catch (error) {
        console.error('Error updating items:', error);
      }
    };

    updateItems();
  }, [coveyTownController, petShop, username]);

  const closeModal = useCallback(() => {
    if (petShop) {
      coveyTownController.interactEnd(petShop);
    }
  }, [coveyTownController, petShop]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        closeModal();
        coveyTownController.unPause();
      }}>
      <ModalOverlay />
      <ModalContent maxW='2xl'>
        <ModalHeader>Welcome to the {petShop?.name.toLocaleLowerCase()}! </ModalHeader>
        <ModalCloseButton />
        <form
          onSubmit={ev => {
            ev.preventDefault();
          }}>
          <ModalBody pb={6}>
            <Tabs colorScheme='blue' defaultIndex={0}>
              <TabList>
                <Tab>Sell</Tab>
                <Tab>Purchase</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Flex flexDirection='row' flexWrap='wrap'>
                    {items && items.length > 0 ? (
                      items.map((item, index) => (
                        <SaleItem
                          key={index}
                          item={ITEMS[item - 1]}
                          index={index}
                          selectedItem={selectedItemForSale}
                          setItem={setItemForSale}
                          onClick={() => {
                            sell();
                          }}
                          closeModal={closeModal}
                          toast={toast}
                        />
                      ))
                    ) : (
                      <Box>No pets to sell yet.</Box>
                    )}
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex flexDirection='row' flexWrap='wrap'>
                    {ITEMS.map((item, index) => (
                      <PurchaseItem
                        key={index}
                        item={item}
                        index={index}
                        selectedItem={selectedItemForPurchase}
                        setItem={setItemForPurchase}
                        onClick={() => {
                          purchase();
                        }}
                        closeModal={closeModal}
                        toast={toast}
                      />
                    ))}
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
}
