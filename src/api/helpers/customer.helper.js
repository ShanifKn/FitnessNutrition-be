import CartRepository from "../../database/repositories/cart.repositories.js";
import CustomerRespository from "../../database/repositories/customer.respositories.js";

class CustomerHelper {
  constructor() {
    this.respository = new CustomerRespository();
    this.cartRepository = new CartRepository();

  }

  async GetCustomer() {
    return await this.respository.GetCustomer();
  }

  async GetCustomerDetails({ _id }) {
    const user = await this.respository.GetCustomerDetails({ _id });

    const cart = await this.cartRepository.GetCarts({ _id });

    const wishlist = await this.cartRepository.Getwishlist({ _id });

    const data = { user: user, wishlist: wishlist, cart: cart };

    return data;
  }



  async GetCustomerCount({ userId }) {

    const orders = await this.respository.GetCustomerOrder({ userId });

    const deliveredOrdersCount = orders.filter(order => order.orderComfirmed === "delivered").length;

    // Calculate total product price
    const totalProductPrice = orders
      .filter(order => order.orderComfirmed === "delivered")
      .reduce((total, order) => {
        return total + order.product.reduce((sum, product) => sum + product.price, 0);
      }, 0);

    const data = {
      orders: orders.length || 0,
      invoice: deliveredOrdersCount || 0,
      value: totalProductPrice || 0
    }

    return data
  }
}

export default CustomerHelper;
