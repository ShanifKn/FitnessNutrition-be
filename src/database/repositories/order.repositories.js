import { Cart } from "../models/cart.model.js";
import { Orders } from "../models/order.model.js";

class OrderRepository {
  async createOrder({ user, billingInfo, product, paymentMethod, payment, shippingAddress, discountCoupon, discountAmount, orderComfirmed, total }) {
    const newOrder = new Orders({
      user,
      billingInfo,
      product,
      paymentMethod,
      payment,
      shippingAddress,
      discountCoupon,
      discountAmount,
      orderComfirmed,
      total,
    });

    // Save the order to the database
    return await newOrder.save();
  }

  async findOrderWithDetails({ user }) {
    return await Orders.findOne({ user })
      .populate({
        path: "user", // Populate user details
      })
      .populate({
        path: "product.productId", // Populate product details for each product in the array
      });
  }

  async UpdateSalesOrderId(_id, orderId) {
    return await Orders.updateOne({ _id }, { $set: { salesorderId: orderId } });
  }

  async deletCartByUser(_id) {
    return await Cart.deleteOne({ user: _id });
  }

  async GetOrdersCount({ status }) {
    return await Orders.countDocuments({
      orderComfirmed: status,
    });
  }

  async GetOrdersCounts() {
    return await Orders.countDocuments();
  }

  async GetOrders({ pageInt, limitInt, skip }) {
    return await Orders.find().skip(skip).limit(limitInt).exec();
  }

  async GetReturnOrders({ pageInt, limitInt, skip }) {
    return await Orders.find({
      orderComfirmed: "return pending",
    })
      .skip(skip)
      .limit(limitInt)
      .exec();
  }

  async GetOrdersDetails({ _id }) {
    return await Orders.findOne({ _id });
  }
}

export default OrderRepository;
