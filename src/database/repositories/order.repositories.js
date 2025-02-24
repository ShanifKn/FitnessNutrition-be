import { Cart } from "../models/cart.model.js";
import { Orders } from "../models/order.model.js";
import { OrderStatus } from "../models/orderStatus.model.js";

class OrderRepository {
  async createOrder({ user, billingInfo, product, paymentMethod, payment, shippingAddress, discountCoupon, discountAmount, orderComfirmed, total, payById, itemsTotal, deliveryCharge, vat }) {
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
      payById,
      itemsTotal,
      deliveryCharge,
      vat,
    });

    // Save the order to the database
    return await newOrder.save();
  }

  async findOrderWithDetails({ _id }) {
    return await Orders.findOne({ _id })
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
    return await Orders.findOne({ _id })
      .populate({
        path: "user",
        select: "name email phone image", // Include only these fields from the user document
      })
      .populate({
        path: "product.productId", // Populate productId within the product array
        select: "_id images name rate maxDiscount",
      });
  }

  async GetUserOrderCount(_id) {
    return await Orders.countDocuments({ user: _id });
  }

  async UpdateOrder({ _id, orderComfirmed, invoiceId, product, remark }) {
    return await Orders.findByIdAndUpdate({ _id }, { $set: { orderComfirmed, invoiceId, product, remark } }, { new: true, runValidators: true });
  }
  async AddOrderTimeline(data) {
    return await OrderStatus.create(data);
  }

  async GetOrdersStatus({ _id }) {
    return await OrderStatus.findOne({ orderId: _id });
  }

  async GetUserOrders({ user }) {
    return await Orders.find({ user: user })
      .populate({
        path: "product.productId",
        select: "_id name rate images rating maxDiscount",
        // Populate productId within the product array
      })
      .lean();
  }

  async GetUserOrderStatus({ _id }) {
    return await OrderStatus.findOne({ orderId: _id }).lean().select("orderTimeline -_id");
  }

  async GetUserOrderDetails({ _id }) {
    return await Orders.findOne({ _id }).lean();
  }

  async UpdateOrderTimeline({ orderId, status, element, driverId }) {
    const updateFields = {
      [`orderTimeline.${element}.status`]: status,
      [`orderTimeline.${element}.date`]: new Date(),
      [`orderTimeline.${element}.time`]: new Date().toLocaleTimeString(),
      [`orderTimeline.${element}.completed`]: true,
    };

    // Only add driverId if it's provided
    if (driverId) {
      updateFields.driverId = driverId;
    }

    return await OrderStatus.findOneAndUpdate(
      { orderId: orderId },
      { $set: updateFields },
      { new: true } // Returns the updated document
    );
  }
}

export default OrderRepository;
