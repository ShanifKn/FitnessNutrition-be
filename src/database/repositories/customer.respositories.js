import { Customer } from "../models/customer.model.js";

class CustomerRespository {
  async GetCustomer() {
    return await Customer.find().select("name email customerId phone createdAt");
  }

  async GetCustomerDetails({ _id }) {
    return await Customer.findOne({ _id }).select(" -password");
  }
}

export default CustomerRespository;
