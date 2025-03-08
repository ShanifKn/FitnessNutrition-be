import OrderHelper from "../api/helpers/order.helper.js";

class OrderService {
  constructor() {
    this.helpers = new OrderHelper();
  }

  async createOrder({ user, billingInfo, product, paymentMethod, payment, shippingAddress, discountCoupon, discountAmount, orderComfirmed, total, payById, itemsTotal, deliveryCharge, vat }) {
    return await this.helpers.createOrder({ user, billingInfo, product, paymentMethod, payment, shippingAddress, discountCoupon, discountAmount, orderComfirmed, total, payById, itemsTotal, deliveryCharge, vat });
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

  async UpdateOrder({ _id, orderComfirmed, invoiceId, product, remark }) {
    return await this.helpers.UpdateOrder({ _id, orderComfirmed, invoiceId, product, remark });
  }

  async GetOrdersStatus({ _id }) {
    return await this.helpers.GetOrdersStatus({ _id });
  }

  async GetUserOrder({ user }) {
    return await this.helpers.GetUserOrder({ user });
  }

  async GetUserOrderDetails({ _id }) {
    return await this.helpers.GetUserOrderDetails({ _id });
  }

  async AssignOrder({ driverId, orderId }) {
    return await this.helpers.AssignOrder({ driverId, orderId });
  }


  async CreateReview({ userId, orderId, productId, rating, review }) {
    return await this.helpers.CreateReview({ userId, orderId, productId, rating, review })
  }


  async GetProductReviews({ _id }) {
    return await this.helpers.GetProductReviews({ _id })
  }


  async GetDeliveryCharge() {
    return await this.helpers.GetDeliveryCharge()
  }

  async AddDeliveryCharge({ userId, deliveryCharge }) {
    return await this.helpers.AddDeliveryCharge({ userId, deliveryCharge })
  }


  async AcceptOrder({ orderId, accept, driverId }) {
    return await this.helpers.AcceptOrder({ orderId, accept, driverId })
  }
}

export default OrderService;
