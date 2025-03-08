import OrderRepository from "../../database/repositories/order.repositories.js";
import ProductRepository from "../../database/repositories/product.repositories.js";
import UserRepository from "../../database/repositories/user.repositories.js";
import MailService from "../../services/mail.service.js";
import ZohoService from "../../services/zoho.service.js";

class OrderHelper {
  constructor() {
    this.repository = new OrderRepository();
    this.zohoService = new ZohoService();
    this.mail = new MailService();
    this.user = new UserRepository();
    this.product = new ProductRepository();
  }

  // async createOrder({ user, billingInfo, product, paymentMethod, payment, shippingAddress, discountCoupon, discountAmount, orderComfirmed, total, payById, itemsTotal, deliveryCharge, vat }) {
  //   let message = "";

  //   let pending = false;

  //   // const order = await this.repository.findOrderWithDetails({ user });

  //   // if (order && order.orderComfirmed === "pending") {
  //   //   message = "Previous order is on pending. Once it is confirmed, you can place another order.";

  //   //   pending = true;
  //   // } else {
  //   const { _id } = await this.repository.createOrder({ user, billingInfo, product, paymentMethod, payment, shippingAddress, discountCoupon, discountAmount, orderComfirmed, total, payById, itemsTotal, deliveryCharge, vat });

  //   const order = await this.repository.findOrderWithDetails({ _id });

  //   message = "Order Placed successfully";

  //   await this.CreateZohoSalesOrder(order);
  //   // }

  //   return { message, pending };
  // }

  // async CreateZohoSalesOrder(userDetails) {
  //   const { user, product, shippingAddress, _id, orderNumber, total } = userDetails;

  //   const customerPayload = {
  //     customer_id: user.customerId,
  //   };

  //   // Map product fields to line_items
  //   const lineItems = product.map((product, index) => ({
  //     item_order: index,
  //     item_id: product.productId.item_id,
  //     name: product.productId.name || product.productId.item_name,
  //     rate: product.productId.rate,
  //     description: product.productId.description,
  //     quantity: product.quantity, // Default to 1 or fetch dynamically
  //     product_type: product.productId.product_type || "goods",
  //     unit: product.productId.unit || "Nos",
  //     tax_id: product.productId.tax_id || null,
  //     discount: "0", // Default to no discount
  //   }));

  //   const zohoPayload = {
  //     ...customerPayload,
  //     date: new Date().toISOString().split("T")[0], // Current date
  //     line_items: lineItems,
  //     notes: "Order created via integration",
  //   };

  //   const { created, salesOrder } = await this.zohoService.CreateSalesOrder({ zohoPayload });

  //   if (created) await this.repository.UpdateSalesOrderId(_id, salesOrder.salesorder_id);

  //   if (created) await this.repository.deletCartByUser(user._id);

  //   const orderDetails = {
  //     orderNumber,
  //     orderDate: new Date().toISOString().split("T")[0],
  //     totalAmount: total,
  //   };

  //   if (created) this.mail.sendOrderPlacedMail(user.email, orderDetails);
  // }

  async createOrder({ user, billingInfo, product, paymentMethod, payment, shippingAddress, discountCoupon, discountAmount, orderComfirmed, total, payById, itemsTotal, deliveryCharge, vat }) {
    let message = "";
    let pending = false;

    const users = await this.user.GetUserData({ user });

    // First, create Zoho Sales Order
    const zohoOrderDetails = await this.CreateZohoSalesOrder({ users, product, shippingAddress, total });

    if (!zohoOrderDetails || !zohoOrderDetails.created) {
      return { message: "Failed to create Zoho Sales Order. Order not placed.", pending: true };
    }

    // Create Order in the database after Zoho order is successful
    const { _id } = await this.repository.createOrder({
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

    const order = await this.repository.findOrderWithDetails({ _id });

    message = "Order Placed successfully";

    return { message, pending };
  }

  async CreateZohoSalesOrder({ users, product, shippingAddress, total }) {
    const customerPayload = {
      customer_id: users.customerId,
    };

    const lineItems = await Promise.all(
      product.map(async (product, index) => {
        const _id = product.productId;
        const prod = await this.product.GetProductDetails({ _id });

        return {
          item_order: index,
          item_id: prod.item_id,
          name: prod.name || prod.item_name,
          rate: product.price,
          description: prod.description,
          quantity: product.quantity, // Default to 1 or fetch dynamically
          product_type: prod.product_type || "goods",
          unit: prod.unit || "Nos",
          tax_id: prod.tax_id || null,
          discount: prod.maxDiscount, // Default to no discount
        };
      })
    );

    const zohoPayload = {
      ...customerPayload,
      date: new Date().toISOString().split("T")[0], // Current date
      line_items: lineItems,
      notes: "Order created via integration",
    };

    const { created, salesOrder } = await this.zohoService.CreateSalesOrder({ zohoPayload });

    if (created) {
      await this.repository.UpdateSalesOrderId(users._id, salesOrder.salesorder_id);
      await this.repository.deletCartByUser(users._id);

      const orderDetails = {
        orderNumber: salesOrder.salesorder_number,
        orderDate: new Date().toISOString().split("T")[0],
        totalAmount: total,
      };

      setTimeout(async () => {
        this.mail.sendOrderPlacedMail(users.email, orderDetails);
      }, 2000)


    }

    return { created, salesOrder };
  }

  async GetOrdersCount() {
    // Example usage
    const pendingOrders = await this.repository.GetOrdersCount("pending");
    const cancelledOrders = await this.repository.GetOrdersCount("cancelled");
    const deliveredOrders = await this.repository.GetOrdersCount( "delivered");
    const totalOrders = await this.repository.GetOrdersCounts();

    const data = {
      pendingOrders,
      cancelledOrders,
      deliveredOrders,
      totalOrders,
    };

    return data;
  }

  async GetOrders({ pageInt, limitInt, skip }) {
    return await this.repository.GetOrders({ pageInt, limitInt, skip });
  }

  async GetReturnOrders({ pageInt, limitInt, skip }) {
    return await this.repository.GetReturnOrders({ pageInt, limitInt, skip });
  }

  async GetOrdersDetails({ _id }) {
    let user = await this.repository.GetOrdersDetails({ _id });

    const total = await this.repository.GetUserOrderCount(user.user);

    // Convert the user document to a plain object (if it's not already)
    user = user.toObject ? user.toObject() : user;

    // Add the totalOrder key
    user.totalOrder = total;

    return user;
  }

  async UpdateOrder({ _id, orderComfirmed, invoiceId, product, remark }) {
    let orderTimeline;

    const data = await this.repository.UpdateOrder({ _id, orderComfirmed, invoiceId, product, remark });

    if (orderComfirmed === "confirmed") {
      orderTimeline = await this.OrderTracking({ _id });

      setTimeout(async () => {
        await this.UpdateProductStock({ product });
        await this.sendConfirmationEmail({ _id });
      }, 1000); // Delay of 3 seconds (3000 milliseconds)
    }


    if (orderComfirmed === "delivered") {
      await this.repository.UpdateOrderTimeline({ orderId: _id, status: "Delivered", element: 3 })
    }

    const datas = {
      data,
      orderTimeline,
    };

    return datas;
  }


  async UpdateProductStock({ product }) {
    for (const item of product) {
      if (item.status === 'confirmed') {
        return await this.repository.UpdateProductStock({ _id: item._id, quanity: item.quantity })
      }
    }
  }


  async sendConfirmationEmail({ _id }) {
    const data = await this.repository.GetOrdersDetails({ _id });

    const { user, invoiceId, orderNumber, total } = data;

    const orderDetails = {
      orderNumber,
      orderDate: new Date().toISOString().split("T")[0],
      totalAmount: total,
      invoiceId,
    };

    return this.mail.sendOrderConfirmationMail(user.email, orderDetails);
  }

  async OrderTracking({ _id }) {
    const data = {
      orderId: _id,
      orderTimeline: [
        { status: "Order Confirmed", date: new Date(), time: new Date().toLocaleTimeString(), completed: true },
        { status: "Pending", date: "", time: "" },
        { status: "Pending", date: "", time: "" },
        { status: "Pending", date: "", time: "" },
      ],
    };

    return await this.repository.AddOrderTimeline(data);
  }

  async GetOrdersStatus({ _id }) {
    return await this.repository.GetOrdersStatus({ _id });
  }

  async GetUserOrder({ user }) {
    const orders = await this.repository.GetUserOrders({ user });

    if (!orders || orders.length === 0) return [];

    // Fetch status for each order
    const ordersWithStatus = await Promise.all(
      orders.map(async (order) => {
        const status = await this.repository.GetUserOrderStatus({ _id: order._id });

        return { ...order, status };
      })
    );

    return ordersWithStatus;
  }

  async GetUserOrderDetails({ _id }) {
    const order = await this.repository.GetUserOrderDetails({ _id });

    if (!order) return null;

    const status = await this.repository.GetUserOrderStatus({ _id: order._id });

    return { ...order, status };
  }

  async AssignOrder({ driverId, orderId }) {
    await this.repository.UpdateOrderTimeline({ orderId, status: "Pick-up", element: 1, driverId });

    return { message: "Order Assigned" };
  }


  async CreateReview({ userId, orderId, productId, rating, review }) {
    await this.repository.UpdateOrderProductReview({ orderId, productId })

    await this.repository.CreateReview({ userId, orderId, productId, rating, review })


    return { message: "Product review added!" };
  }

  async GetProductReviews({ _id }) {
    return await this.repository.GetProductReviews({ _id })
  }

  async GetDeliveryCharge() {
    return await this.repository.GetDeliveryCharge()
  }

  async AddDeliveryCharge({ userId, deliveryCharge }) {
    return await this.repository.AddDeliveryCharge({ userId, deliveryCharge })
  }


  async AcceptOrder({ orderId, accept, driverId }) {



    if (accept) {
      await this.repository.UpdateOrderTimeline({ orderId, status: "Dispatched", element: 2, driverId });

      return { message: "Order Dispatched" };
    } else {
      await this.repository.UpdateOrderTimeline({ orderId, status: "Pending", element: 1, driverId });

      return { message: "Order Return to pickup" };
    }
  }
}

export default OrderHelper;
