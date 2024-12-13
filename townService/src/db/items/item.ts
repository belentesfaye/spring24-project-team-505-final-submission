class Item {
  private _itemId: number;

  private _itemName: string;

  private _itemValue: number;

  private _spritePath: string;

  private _canHaveEffect: boolean;

  private _effect: string;

  private _speed: number;

  constructor(
    itemId: number,
    itemName: string,
    spritePath: string,
    itemValue: number,
    effect: string,
    speed: number,
  ) {
    this._itemId = itemId;
    this._itemName = itemName;
    this._itemValue = itemValue;
    this._spritePath = spritePath;
    this._speed = speed;

    // effect identifying logic + setting
    if (effect === '') {
      this._canHaveEffect = false;
      this._effect = '';
    } else {
      this._canHaveEffect = true;
      this._effect = effect;
    }
  }

  getItemId(): number {
    return this._itemId;
  }

  getItemName(): string {
    return this._itemName;
  }

  getSpritePath(): string {
    return this._spritePath;
  }

  getEffect(): string {
    return this._effect;
  }

  getSpeed(): number {
    return this._speed;
  }
}

export default Item;
