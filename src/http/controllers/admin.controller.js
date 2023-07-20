const Controller = require("../../base/controller");
const AdminService = require("../../services/admin.service");

class AdminController extends Controller {
  #adminService = new AdminService();

  async create({ response, body }) {
    try {
      const admin = await this.#adminService.create(body);
      response({ data: admin, code: "CREATED" });
    } catch (error) {
      if (this.#isEmailDuplicateError(error)) {
        return this.#handleDuplicateEmail(response);
      }
    }
  }

  #isEmailDuplicateError = (error) => {
    return error.message === "Email already exists";
  };

  #handleDuplicateEmail = (response) => {
    return response({ code: "EMAIL_ALREADY_EXISTS" });
  };

  async findById({ response, params }) {
    try {
      const admin = await this.#adminService.findById(params.id);
      response({ data: admin });
    } catch (error) {
      if (this.#isNotFoundError(error)) return this.#handleNotFound(response);
      throw error;
    }
  }

  #isNotFoundError = (error) => error.message === "Admin not found";

  #handleNotFound = (response) => response({ code: "ADMIN_NOT_FOUND" });

  async update({ response, params, body }) {
    try {
      const admin = await this.#adminService.update(params.id, body);
      response({ data: admin });
    } catch (error) {
      if (this.#isNotFoundError(error)) return this.#handleNotFound(response);
      if (this.#isEmailDuplicateError(error)) {
        return this.#handleDuplicateEmail(response);
      }
      throw error;
    }
  }

  async delete({ response, params }) {
    try {
      const admin = await this.#adminService.delete(params.id);
      response({ data: admin });
    } catch (error) {
      if (this.#isNotFoundError(error)) return this.#handleNotFound();
      throw error;
    }
  }

  async getAll({ response }) {
    const admins = await this.#adminService.getAll();
    response({ data: admins });
  }
}

module.exports = new AdminController();
