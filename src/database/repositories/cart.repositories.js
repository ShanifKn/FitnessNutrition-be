import { Cart } from "../models/cart.model.js";
import { Wishlist } from "../models/wishlist.model.js";

class CartRepository {
  async CreateCart({ user, fetchProduct }) {
    const newCart = new Cart({
      user: user,
      items: fetchProduct,
    });

    return await newCart.save();
  }

  async UpdateCart({ user, productId, quantity }) {

    const cart = await Cart.findOne({ user });

    const item = cart.items.find((item) => item.product.toString() === productId);

    // Update the item's quantity and total
    item.quantity = quantity;
    item.total = item.price * quantity;

    // Recalculate totalQuantity and totalPrice
    cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.total, 0);

    // Save the updated cart
    await cart.save();
  }

  async GetCarts({ _id }) {
    return await Cart.findOne({ user: _id }).select(" -user  -__v").populate({
      path: "items.product", // Specify the field to populate
      select: "_id name rate value rating stock_on_hand images quantity total ", // Fields to include in the populated data
    });
  }

  async CreateWishlist({ user, items }) {
    const newCart = new Wishlist({
      user,
      items,
    });

    return await newCart.save();
  }

  async UpdateWishlist({ _id, items }) {
    return await Wishlist.updateOne(
      { _id },
      {
        $push: {
          items: { $each: items },
        },
      }
    );
  }

  async GetWish({ user }) {
    return await Wishlist.findOne({ user });
  }

  async Getwishlist({ _id }) {
    return await Wishlist.findOne({ user: _id }).select(" -user  -__v").populate({
      path: "items.productId", // Specify the field to populate
      select: "_id name rate value rating stock_on_hand images", // Fields to include in the populated data
    });
  }

  async GetWishlist({ _id }) {
    return await Wishlist.findOne({ user: _id }).select(" -user  -__v").populate({
      path: "items.productId", // Specify the field to populate
      select: "_id name rate value rating stock_on_hand images", // Fields to include in the populated data
    });
  }

  async DeleteProductFromWishlist({ userId, _id }) {
    return await Wishlist.updateOne(
      { user: userId }, // Find the wishlist by user ID
      { $pull: { items: { _id } } } // Remove the product from the items array
    );
  }

  async GetUserCart({ user }) {
    return await Cart.findOne({ user });
  }

  async UpdateUserCart({ user, fetchProduct }) {
    // Fetch the cart for the user
    const cart = await Cart.findOne({ user });

    // Add new items to the cart
    cart.items.push(...fetchProduct);

    // Recalculate totalQuantity and totalPrice
    cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.total, 0);

    // Save the updated cart
    return await cart.save();
  }

  async DeleteCartItem({ cart }) {
    return await cart.save();
  }
}

export default CartRepository;
