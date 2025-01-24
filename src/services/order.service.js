import OrderHelper from "../api/helpers/order.helper.js";

class OrderService {
  constructor() {
    this.helpers = new OrderHelper();
  }

  async createOrder({ user, billingInfo, product, paymentMethod, payment, shippingAddress, discountCoupon, discountAmount, orderComfirmed, total }) {
    return await this.helpers.createOrder({ user, billingInfo, product, paymentMethod, payment, shippingAddress, discountCoupon, discountAmount, orderComfirmed, total });
  }
}

export default OrderService;
