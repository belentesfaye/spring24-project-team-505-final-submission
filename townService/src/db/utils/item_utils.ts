import fs from 'fs';
import path from 'path';
import Item from '../items/item';
import User from '../models/user';

async function getItemById(itemId: number): Promise<Item | undefined> {
  const itemsJsonPath = path.join(__dirname, '../items/items.json'); // Adjust the path if necessary
  const itemsData = await fs.promises.readFile(itemsJsonPath, 'utf-8');
  const items = JSON.parse(itemsData);

  try {
    const itemData = items.find((item: any) => item.itemId === itemId); // trying to avoid using 'any' but it's a json file
    if (itemData) {
      return new Item(
        itemData.itemId,
        itemData.itemName,
        itemData.itemValue,
        itemData.spritePath,
        itemData.effect,
        itemData.speed,
      );
    }
    throw new Error('Item not found');
  } catch (error) {
    return undefined;
  }
}
async function convertAllItems(userId: string): Promise<Item[]> {
  const thisUser = await User.findById(userId);
  if (!thisUser) {
    throw new Error('User not found');
  }

  const userItems = thisUser.playerstats.items;
  const itemPromises = userItems.map(itemId => getItemById(itemId));
  const itemObjs = (await Promise.all(itemPromises)).filter(
    (item): item is Item => item !== undefined,
  );
  const hasNullItem = itemObjs.some(item => item === null);
  if (hasNullItem) {
    throw new Error('Item not found');
  }

  return itemObjs;
}
