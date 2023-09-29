const Tenant = require("./model");
const User = require("../user/model");
const Permission = require("../permission/model");

// Create a new tenant
exports.createTenant = async (req, res) => {
  try {
    const {
      name,
      phone,
      website,
      registration,
      baghdad_price,
      governments_price,
      delivery_price,
      additional_price,
      additional_price_for_weight,
      additional_price_for_unused,
      auto_update,
    } = req.body;

    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (!user.super_admin && !user.permission?.add_tenant) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const tenant = await Tenant.create({
      name,
      logo: req.file ? req.file.filename : null,
      phone,
      website,
      registration,
      baghdad_price,
      governments_price,
      delivery_price,
      additional_price,
      additional_price_for_weight,
      additional_price_for_unused,
      auto_update,
    });

    res.status(201).json(tenant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all tenants
exports.getTenants = async (req, res) => {
  const { size, page } = req.query;

  const { host } = req;

  try {
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (!user.super_admin && !user.permission?.add_tenant) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    let tenants = null;

    if (page) {
      tenants = await Tenant.findAll({ limit, offset });
    } else {
      tenants = await Tenant.findAll();
    }

    const count = await Tenant.count();
    const numOfPages = Math.ceil(count / limit); // Calculate number of pages

    // Concatenate logo URL with "http://" and host
    const tenantsWithLogoURL = tenants.map((tenant) => {
      const logoURL = `http://${host}/uploads/${tenant.logo}`;
      return { ...tenant.toJSON(), logo: tenant.logo ? logoURL : null };
    });

    return res
      .status(200)
      .json({ count, pages: numOfPages, results: tenantsWithLogoURL });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a single tenant by ID
exports.getTenantById = async (req, res) => {
  const { host } = req;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (!user.super_admin && !user.permission?.add_tenant) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const { id } = req.params;

    const tenant = await Tenant.findByPk(id);

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    res.status(200).json({
      tenant: {
        ...tenant.toJSON(),
        logo: `http://${host}/uploads/${tenant.logo}`,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a tenant by ID
exports.updateTenant = async (req, res) => {
  const { id } = req.params;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Permission, Tenant],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (
      !user.super_admin &&
      !user.permission?.add_tenant &&
      +user.tenant.id !== +id
    ) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const tenant = await Tenant.findByPk(id);

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    await tenant.update({
      ...req.body,
      logo: req.file ? req.file.filename : tenant.logo,
    });

    res.status(200).json(tenant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a tenant by ID
exports.deleteTenant = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (!user.super_admin && !user.permission?.add_tenant) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const { id } = req.params;

    const tenant = await Tenant.findByPk(id);

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    await tenant.destroy();

    res.status(204).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
