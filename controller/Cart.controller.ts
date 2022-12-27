import { NextApiRequest, NextApiResponse } from 'next';

export default class CartItemController {
  static addToCart = async (req: NextApiRequest, res: NextApiResponse) => {
    // todo - add to cart
    if (!req.session.user) {
      res.status(400).json({
        message: 'Please login first',
      });
      return;
    }

    if (req.session.user && req.session.user.admin) {
      res.status(400).json({
        message: 'Only customer can add to cart',
      });
      return;
    }

    // check if cart already exist by status (cart model)
    // get cart is if cart exist (cart model)
    // if not exist, create new cart with params customer id (cart model)
    // get new created cart id (cart model)
    // use cart id to add into item - use method in item model (item model)

    res.send('post cart item controller');
  };

  static getCart = async (req: NextApiRequest, res: NextApiResponse) => {
    // get customer cart

    res.send('get cart item controller');
  };
}
