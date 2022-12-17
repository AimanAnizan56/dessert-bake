import { makeQuery } from '../lib/mysql_config';

export default class Product {
  private readonly id!: number;
  private name: string;
  private price: number;
  private description: string;
  private type: string;
  private imagePath!: string;

  constructor(name: string, price: number, description: string, type: string) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.type = type;
  }

  setImage = (image: any) => {
    this.imagePath = (image.path as string).replaceAll('\\', '/').replace('public', '');
  };

  create = async () => {
    const row = makeQuery('INSERT INTO product (product_name, product_price, product_type, product_description, product_image_path) VALUES (?,?,?,?,?)', [this.name, this.price, this.type, this.description, this.imagePath]);
    const data = await row;

    if (data.affectedRows == 1) {
      return {
        id: data.insertId,
        name: this.name,
        price: this.price,
        type: this.type,
        description: this.description,
        imagePath: this.imagePath,
      };
    }

    return {
      error: 'Could not insert product',
    };
  };
}