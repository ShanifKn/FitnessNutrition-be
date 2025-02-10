import PaybyHelper from "../api/helpers/payby.helper.js";

class PaybyService {
  constructor() {
    this.helper = new PaybyHelper();
  }

  async CreateOrder({ orderId }) {


    return await this.helper.CreateOrder({ orderId });
  }
}

export default PaybyService;
