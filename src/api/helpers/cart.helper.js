import CartRepository from "../../database/repositories/cart.repositories.js";
import ProductRepository from "../../database/repositories/product.repositories.js";

class CartHelper {
  constructor() {
    this.productRepository = new ProductRepository();
    this.repository = new CartRepository();
  }

  async FetchProducts({ items }) {
    const cartItems = [];

    for (const item of items) {
      const product = await this.productRepository.ProductDetails(item.productId);

      const price = product.rate;
      const total = price * item.quantity; // Calculate total for this product

      // Add to the cart items array
      cartItems.push({
        product: item.productId,
        quantity: item.quantity,
        price: product.rate,
        total,
      });
    }

    return cartItems;
  }

  async CreateCart({ user, fetchProduct }) {
    return await this.repository.CreateCart({ user, fetchProduct });
  }

  async UpdateCart({ _id, featchProduct }) {
    return await this.repository.UpdateCart({ _id, featchProduct });
  }

  async GetCarts({ _id }) {
    return await this.repository.GetCarts({ _id });
  }

  async CreateWishlist({ user, items }) {
    const userData = await this.repository.GetWish({ user });

    if (!userData) {
      return await this.repository.CreateWishlist({ user, items });
    } else {
      const { _id } = userData;

      return await this.repository.UpdateWishlist({ _id, items });
    }
  }

  async UpdateWishlist({ _id, items }) {
    return await this.repository.UpdateWishlist({ _id, items });
  }

  async GetWishlist({ _id }) {
    return await this.repository.GetWishlist({ _id });
  }

  async DeleteProductFromWishlist({ userId, _id }) {
    return await this.repository.DeleteProductFromWishlist({ userId, _id });
  }
}

export default CartHelper;
