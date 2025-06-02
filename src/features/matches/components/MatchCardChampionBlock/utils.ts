import { ITEMS_COUNT } from './constants';

export const transformItemsForRender = (items?: number[]) => {
  if (!items || items.length === 0) {
    return [...Array(ITEMS_COUNT)].map((_, i) => ({ id: i, itemId: 0 }));
  }
  return items.map((itemId: number, i: number) => ({
    id: i,
    itemId,
  }));
};

export const getItemImageSrc = (itemId: number) => `/assets/item/${itemId}.png`;

export const getEmptySlotKey = (index: number) => `empty-${index}`;
export const getItemKey = (itemId: number, index: number) =>
  `item-${itemId}-${index}`;
