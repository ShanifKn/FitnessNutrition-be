import DriverHelper from "../api/helpers/driver.helper.js";

class DriverService {
  constructor() {
    this.helper = new DriverHelper();
  }

  async createDriver({ image, name, email, phone, whatappPhone, branch, location, dlNo }) {
    return await this.helper.createDriver({ image, name, email, phone, whatappPhone, branch, location, dlNo });
  }

  async getDriverWithLimit({ page, limit }) {
    const skip = (page - 1) * limit; // Calculate how many records to skip

    // Convert page and limit to integers
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);

    return await this.helper.getDriverWithLimit({ pageInt, limitInt, skip });
  }

  async getDriverDetails({ _id }) {
    return await this.helper.getDriverDetails({ _id });
  }

  async updateDriver({ _id, image, name, email, phone, whatappPhone, branch, location, dlNo, active }) {
    return await this.helper.updateDriver({ _id, image, name, email, phone, whatappPhone, branch, location, dlNo, active });
  }

  async driverLogin({ email, password }) {
    return await this.helper.driverLogin({ email, password });
  }

  async resetPassword({ email }) {
    return await this.helper.resetPassword({ email });
  }


  async getDriverOrderCount({ driverId }) {
    return await this.helper.getDriverOrderCount({ driverId })
  }


  async getDriverPendingOrders({ _id }) {
    return await this.helper.getDriverPendingOrders({ _id })
  }
}

export default DriverService;
