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
}

export default CustomerHelper;
