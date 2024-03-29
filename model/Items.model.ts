import { makeQuery } from '../lib/mysql_config';

export default class Item {
  private item_id!: number;
  private product_id!: number;
  private cart_id!: number;
  private item_price!: number;
  private item_quantity!: number;

  setItem = async (product_id: number, cart_id: number) => {
    try {
      this.product_id = product_id;
      this.cart_id = cart_id;
      let row: any = await makeQuery('SELECT item_id, item_quantity FROM items WHERE product_id=? AND cart_id=?', [this.product_id, this.cart_id]);
      const temp = row;

      row = await makeQuery('SELECT product_price as item_price FROM product WHERE product_id=?', [this.product_id]);
      this.item_price = row[0].item_price;

      if (temp.length > 0) {
        this.item_id = temp[0].item_id;
        this.item_quantity = temp[0].item_quantity;
        return {
          message: 'Item id exist',
        };
      }

      return {
        message: 'Item id not exist',
      };
    } catch (err) {
      console.log('====================================');
      console.log('setItem Err: ', err);
      console.log('====================================');
    }
  };

  setItemId = async (item_id: number) => {
    this.item_id = item_id;
  };

  setCartId = (cart_id: number) => {
    this.cart_id = cart_id;
  };

  getItem = async () => {
    // get item
    const row: any = await makeQuery('SELECT item_id, items.product_id, item_quantity, item_price, product_name, product_image_path FROM items, product WHERE items.product_id = product.product_id AND product.status="active" AND cart_id=?', [this.cart_id]);

    if (row.length > 0) {
      return {
        message: 'Row retrived',
        data: row,
      };
    }
    return {
      message: 'Empty row',
    };
  };

  createItem = async () => {
    try {
      this.item_quantity = 0;
      const row: any = await makeQuery('INSERT INTO items(product_id, cart_id, item_price, item_quantity) VALUES (?,?,?,?)', [this.product_id, this.cart_id, this.item_price, this.item_quantity]);
      this.item_id = row.insertId;
      return true;
    } catch (err) {
      return false;
    }
  };

  addToCart = async () => {
    const row: any = await makeQuery('UPDATE items SET item_quantity=item_quantity+1 WHERE item_id=?', [this.item_id]);

    if (row.affectedRows == 1) {
      return true;
    }
    return false;
  };

  removeFromCart = async () => {
    let row: any = await makeQuery('SELECT item_quantity FROM items WHERE item_id=?', [this.item_id]);
    let quantity = -99;

    if (row.length != 0) {
      quantity = row[0].item_quantity;
    }

    if (quantity == -99) {
      console.log('====================================');
      console.log('removeFromCart Error');
      console.log('====================================');
      return 'error';
    }

    let sql = 'UPDATE items SET item_quantity=item_quantity-1 WHERE item_id=?';

    if (quantity == 1) {
      // delete the items
      sql = 'DELETE FROM items WHERE item_id=?';
    }

    row = await makeQuery(sql, [this.item_id]);

    if (row.affectedRows == 1) {
      return true;
    }

    return false;
  };

  deleteItem = async () => {
    const row: any = await makeQuery('DELETE FROM items WHERE item_id=?', [this.item_id]);

    if (row.affectedRows == 1) {
      return true;
    } else return false;
  };

  static getCompleteCartItemById = async (cartId: number, customerId: number) => {
    const row: any = await makeQuery('SELECT item_quantity, item_price, product_name, cart_total FROM items, cart, product WHERE cart.cart_id=items.cart_id AND items.product_id = product.product_id AND cart.cart_status="complete" AND cart.cart_id=? AND cart.customer_id=?', [cartId, customerId]);

    if (row.length > 0) {
      return row;
    }

    return [];
  };

  static getAllCartItemByCartId = async (cart_id: number) => {
    const row: any = await makeQuery('SELECT item_id, item_price, item_quantity, product.product_id, product_name, product_image_path FROM items, product WHERE product.product_id=items.product_id AND items.cart_id=?', [cart_id]);

    if (row.length > 0) {
      return row;
    }

    return [];
  };

  static updatePrice = async (product_id: number, new_price: number) => {
    const query = 'UPDATE items, cart SET items.item_price=? WHERE items.cart_id=cart.cart_id AND cart.cart_status="in use" AND product_id=?';

    const row: any = await makeQuery(query, [new_price, product_id]);
  };

  output = () => {
    console.log('====================================');
    console.log('item_id: ', this.item_id);
    console.log('product_id: ', this.product_id);
    console.log('cart_id: ', this.cart_id);
    console.log('item_price: ', this.item_price);
    console.log('item_quantity: ', this.item_quantity);
    console.log('====================================');
  };
}
