import CartHelper from "../api/helpers/cart.helper.js";

class CartService {
  constructor() {
    this.helper = new CartHelper();
  }

  async UpdateCart({ _id, items }) {
    const featchProduct = await this.helper.FetchProducts({ items });

    return await this.helper.UpdateCart({ _id, featchProduct });
  }

  async Create({ user, items }) {
    console.log(user, items);

    const fetchProduct = await this.helper.FetchProducts({ items });
    return await this.helper.CreateCart({ user, fetchProduct });
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
}

export default CartService;
