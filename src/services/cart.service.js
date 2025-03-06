import CartHelper from "../api/helpers/cart.helper.js";

class CartService {
  constructor() {
    this.helper = new CartHelper();
  }

  async UpdateCart({ user, productId, quantity }) {
    return await this.helper.UpdateCart({ user, productId, quantity });
  }

  async Create({ user, productId, quantity }) {
    const userData = await this.helper.GetUserCart({ user });

    const fetchProduct = await this.helper.FetchProducts({ productId, quantity });

    if (!userData) {
      return await this.helper.CreateCart({ user, fetchProduct });
    } else {
      return await this.helper.UpdateUserCart({ user, fetchProduct });
    }
  }

  async DeleteCartItem({ user, productId }) {
    return await this.helper.DeleteCartItem({ user, productId });
  }

  async GetCarts({ _id }) {
    return await this.helper.GetCarts({ _id });
  }

  async CreateWishlist({ user, items }) {
    return await this.helper.CreateWishlist({ user, items });
  }

  async UpdateWishlist({ _id, items }) {
    return await this.helper.UpdateWishlist({ _id, items });
  }

  async GetWishlist({ _id }) {
    return await this.helper.GetWishlist({ _id });
  }

  async DeleteProductFromWishlist({ userId, _id }) {
    await this.helper.DeleteProductFromWishlist({ userId, _id });

    return { message: "Product Removed from Wishlist" };
  }

  async GetCartCount({ _id }) {
    return await this.helper.GetCartCount({ _id });
  }

  async CancelProduct({ orderId }) {
    return await this.helper.CancelProduct({ orderId });
  }
}

export default CartService;
