import CustomerHelper from "../api/helpers/customer.helper.js";

class CustomerService {
  constructor() {
    this.helper = new CustomerHelper();
  }

  async GetCustomer() {
    return await this.helper.GetCustomer();
  }

  async GetCustomerDetails({ _id }) {
    return await this.helper.GetCustomerDetails({ _id });
  }
}

export default CustomerService;
