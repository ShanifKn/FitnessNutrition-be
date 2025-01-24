import OrderRepository from "../../database/repositories/order.repositories.js";
import MailService from "../../services/mail.service.js";
import ZohoService from "../../services/zoho.service.js";

class OrderHelper {
  constructor() {
    this.repository = new OrderRepository();
    this.zohoService = new ZohoService();
    this.mail = new MailService();
  }

  async createOrder({ user, billingInfo, product, paymentMethod, payment, shippingAddress, discountCoupon, discountAmount, orderComfirmed, total }) {
    let message = "";

    let pending = false;

    const order = await this.repository.findOrderWithDetails({ user });

    if (order && order.orderComfirmed === "pending") {
      message = "Previous order is on pending. Once it is confirmed, you can place another order.";

      pending = true;
    } else {
      await this.repository.createOrder({ user, billingInfo, product, paymentMethod, payment, shippingAddress, discountCoupon, discountAmount, orderComfirmed, total });

      const order = await this.repository.findOrderWithDetails({ user });

      message = "Order Placed successfully";

      await this.CreateZohoSalesOrder(order);
    }

    return { message, pending };
  }

  async CreateZohoSalesOrder(userDetails) {
    const { user, product, shippingAddress, _id, orderNumber, total } = userDetails;

    const customerPayload = {
      customer_id: user.customerId,
    };

    // Map product fields to line_items
    const lineItems = product.map((product, index) => ({
      item_order: index,
      item_id: product.productId.item_id,
      name: product.productId.name || product.productId.item_name,
      rate: product.productId.rate,
      description: product.productId.description,
      quantity: product.quantity, // Default to 1 or fetch dynamically
      product_type: product.productId.product_type || "goods",
      unit: product.productId.unit || "Nos",
      tax_id: product.productId.tax_id || null,
      discount: "0", // Default to no discount
    }));

    const zohoPayload = {
      ...customerPayload,
      date: new Date().toISOString().split("T")[0], // Current date
      line_items: lineItems,
      notes: "Order created via integration",
    };

    const { created, salesOrder } = await this.zohoService.CreateSalesOrder({ zohoPayload });

    if (created) await this.repository.UpdateSalesOrderId(_id, salesOrder.salesorder_id);

    if (created) await this.repository.deletCartByUser(user._id);

    const orderDetails = {
      orderNumber,
      orderDate: new Date().toISOString().split("T")[0],
      totalAmount: total,
    };

    if (created) this.mail.sendOrderPlacedMail(user.email, orderDetails);
  }
}

export default OrderHelper;
