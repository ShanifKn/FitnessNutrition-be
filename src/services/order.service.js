import OrderHelper from "../api/helpers/order.helper.js";

class OrderService {
  constructor() {
    this.helpers = new OrderHelper();
  }

  async createOrder({ user, billingInfo, product, paymentMethod, payment, shippingAddress, discountCoupon, discountAmount, orderComfirmed, total }) {
    return await this.helpers.createOrder({ user, billingInfo, product, paymentMethod, payment, shippingAddress, discountCoupon, discountAmount, orderComfirmed, total });
  }

  async GetOrdersCount() {
    return await this.helpers.GetOrdersCount();
  }

  async GetOrders({ page, limit }) {
    const skip = (page - 1) * limit; // Calculate how many records to skip

    // Convert page and limit to integers
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);

    return await this.helpers.GetOrders({ pageInt, limitInt, skip });
  }

  async GetReturnOrders({ page, limit }) {
    const skip = (page - 1) * limit; // Calculate how many records to skip

    // Convert page and limit to integers
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);

    return await this.helpers.GetReturnOrders({ pageInt, limitInt, skip });
  }

  async GetOrdersDetails({ _id }) {
    return await this.helpers.GetOrdersDetails({ _id });
  }
}

export default OrderService;
