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

  async UpdateCart({ _id, featchProduct }) {
    // Calculate totalQuantity and totalPrice
    const totalQuantity = featchProduct.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = featchProduct.reduce((acc, item) => acc + item.total, 0);

    // Update the cart with items, totalQuantity, and totalPrice
    return await Cart.updateOne(
      { _id },
      {
        $set: {
          items: featchProduct,
          totalQuantity,
          totalPrice,
          updatedAt: new Date(), // Optional: Update the timestamp manually
        },
      }
    );
  }

  async GetCarts({ _id }) {
    return await Cart.findOne({ user: _id });
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
}

export default CartRepository;
