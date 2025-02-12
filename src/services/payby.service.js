import PaybyHelper from "../api/helpers/payby.helper.js";

class PaybyService {
  constructor() {
    this.helper = new PaybyHelper();
  }

  async CreateOrder({ formData }) {


    return await this.helper.CreateOrder({ formData });
  }
}

export default PaybyService;
