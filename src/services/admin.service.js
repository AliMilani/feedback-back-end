const AdminModel = require("../models/admin.model");

class AdminService {
  async create(admin) {
    try {
      const createdAdmin = (await AdminModel.create(admin)).toObject()
      return this.#excludePassword(createdAdmin)
    } catch (error) {
      this.#catchDuplicateEmail(error);
      throw error;
    }
  }

  #catchDuplicateEmail = (error) => {
    if (error.code === 11000) {
      if (error.keyValue.email) {
        throw new Error("Email already exists");
      }
    }
  };

  #excludePassword = (admin) => {
    const { password, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  }

  async findById(id) {
    const admin = await AdminModel.findById(id)
    if (admin === null) throw new Error("Admin not found");
    return admin.toObject();
  }

  async delete(id) {
    const deletedAdmin = await AdminModel.findByIdAndDelete(id);
    if (deletedAdmin === null) throw new Error("Admin not found");
    return deletedAdmin.toObject();
  }

  async update(id, admin) {
    try {
      const targetAdmin = await this.findById(id)
      if (admin.email && admin.email === targetAdmin.email) delete admin.email;
      const updatedAdmin = await AdminModel.findByIdAndUpdate(id, admin, {
        new: true,
      });
      return updatedAdmin.toObject();
    } catch (error) {
      this.#catchDuplicateEmail(error);
      throw error;
    }
  }

  async getAll() {
    // todo: add pagination
    const admins = await AdminModel.find().lean();
    return admins.map((admin) => admin.toObject());
  }
}

module.exports = AdminService;
