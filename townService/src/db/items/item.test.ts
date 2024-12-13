import Item from './item';

describe('Item Class', () => {
  it('should create an item with correct properties', () => {
    const item = new Item(1, 'Speed Boots', '/path/to/sprite', 100, 'Speed', 10);
    expect(item.getItemId()).toBe(1);
    expect(item.getItemName()).toBe('Speed Boots');
    expect(item.getSpritePath()).toBe('/path/to/sprite');
    expect(item.getEffect()).toBe('Speed');
    expect(item.getSpeed()).toBe(10);
  });

  it('should indicate when an item does not have an effect', () => {
    const item = new Item(2, 'Cat', '/path/to/cat', 50, '', 1);
    expect(item.getEffect()).toBe('');
    expect(item.getSpeed()).toBe(1);
  });

  it('should correctly handle items with visual effects', () => {
    const item = new Item(3, 'Dog', '/path/to/dog', 150, 'Visual', 1);
    expect(item.getEffect()).toBe('Visual');
  });
});
