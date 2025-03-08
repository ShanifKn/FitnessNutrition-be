import { Customer } from "../models/customer.model.js";
import { Orders } from "../models/order.model.js";

class CustomerRespository {
  async GetCustomer() {
    return await Customer.find().select("name email customerId phone createdAt");
  }

  async GetCustomerDetails({ _id }) {
    return await Customer.findOne({ _id }).select(" -password");
  }


  async GetCustomerOrder({ userId }) {
    return await Orders.find({ user: userId }).lean()
  }
}

export default CustomerRespository;
