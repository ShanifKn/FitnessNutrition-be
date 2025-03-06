import CartRepository from "../../database/repositories/cart.repositories.js";
import OrderRepository from "../../database/repositories/order.repositories.js";
import ProductRepository from "../../database/repositories/product.repositories.js";
import AppError from "../../utils/appError.js";
import { ZOHO_API_ERROR } from "../constants/errorCodes.js";
import PaybyHelper from "./payby.helper.js";

class CartHelper {
  constructor() {
    this.productRepository = new ProductRepository();
    this.orderRepository = new OrderRepository();
    this.repository = new CartRepository();
    this.payby = new PaybyHelper();
  }

  async FetchProducts({ productId, quantity }) {
    const cartItems = [];

    const product = await this.productRepository.ProductDetails(productId);

    const price = product.rate - (product.rate * product.maxDiscount) / 100;
    const total = price * quantity; // Calculate total for this product

    // Add to the cart items array
    cartItems.push({
      product: productId,
      quantity: quantity,
      price: product.rate - (product.rate * product.maxDiscount) / 100,
      total,
      rating: product.rating,
      images: product.images[0],
    });

    return cartItems;
  }

  async CreateCart({ user, fetchProduct }) {
    return await this.repository.CreateCart({ user, fetchProduct });
  }

  async UpdateCart({ user, productId, quantity }) {
    return await this.repository.UpdateCart({ user, productId, quantity });
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

  async GetUserCart({ user }) {
    return await this.repository.GetUserCart({ user });
  }

  async UpdateUserCart({ user, fetchProduct }) {
    return await this.repository.UpdateUserCart({ user, fetchProduct });
  }

  async DeleteCartItem({ user, productId }) {
    const cart = await this.repository.GetUserCart({ user });

    const itemIndex = cart.items.findIndex((item) => item._id.toString() === productId);

    const removedItem = cart.items.splice(itemIndex, 1)[0];

    return await this.repository.DeleteCartItem({ cart });
  }

  async GetCartCount({ _id }) {
    const cart = await this.repository.GetCartCount({ _id });

    if (!cart) return 0;

    return cart.totalQuantity;
  }

  async CancelProduct({ orderId }) {
    let refundOrderNo = "";

    const order = await this.orderRepository.findOrderWithDetails({ _id: orderId });

    if (order.orderComfirmed === "picked") {
      throw new AppError(ZOHO_API_ERROR, "Your Order has been Dispatched", 400);
    }

    if (order.paymentMethod === "PAYBY" && order.payment === true) {
      refundOrderNo = await this.payby.RefundOrder({ order });
    }


    await this.orderRepository.UpdateOrderTimeline({ orderId, status: "Pick-up", element: 1 });

    await this.orderRepository.UpdateOrderTimeline({ orderId, status: "Cancelled", element: 2 });

    return await this.orderRepository.CancelOrder({ _id: orderId, refundOrderNo });
  }
}

export default CartHelper;
