const Branch = require("../branch/model");
const DeliveryRegion = require("../deliveryRegion/model");
const User = require("../user/model");
const Region = require("./model");
const Permission = require("../permission/model");
// Create a new region
exports.createRegion = async (req, res) => {
  const { name, government, userId, branchId } = req.body;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (user.account_type !== "admin" && !user.permission?.add_region) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const region = await Region.create({
      name,
      government,
      tenantId: user.tenantId,
      branchId,
    });

    if (userId) {
      await DeliveryRegion.create({ regionId: region.id, userId });
    }

    return res.status(201).json({ succuss: true, region });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Assign regions to delivery
exports.assignRegionsToDelivery = async (req, res) => {
  const { userId, regions } = req.body;

  try {
    await DeliveryRegion.bulkCreate(
      regions.map((region) => {
        return {
          regionId: region.id,
          userId,
        };
      })
    );

    return res.status(201).message({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get all regions
exports.getRegions = async (req, res) => {
  const { size, page, government, city } = req.query;

  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    let regions = null;

    let filters = {
      tenantId: user.tenantId,
    };

    if (government) {
      filters.government = government;
    }

    if (city) {
      filters.city = city;
    }

    if (page) {
      regions = await Region.findAll({
        limit: limit,
        offset: offset,
        where: filters,
        include: [Branch, User],
      });
    } else {
      regions = await Region.findAll({
        where: filters,
        include: [Branch, User],
      });
    }

    const count = await Region.count({ where: filters });
    const numOfPages = Math.ceil(count / limit); // Calculate number of pages

    return res.status(200).json({ count, pages: numOfPages, results: regions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a single region by ID
exports.getRegionById = async (req, res) => {
  try {
    const { regionId } = req.params;

    const region = await Region.findByPk(regionId);

    if (!region) {
      return res.status(404).json({ message: "Region not found" });
    }

    return res.status(200).json(region);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Update a region by ID
exports.updateRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, government, city } = req.body;

    const region = await Region.findByPk(id);

    if (!region) {
      return res.status(404).json({ message: "Region not found" });
    }

    region.name = name;
    region.government = government;
    region.city = city;

    await region.save();

    res.status(200).json(region);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a region by ID
exports.deleteRegion = async (req, res) => {
  try {
    const { id } = req.params;

    const region = await Region.findByPk(id);

    if (!region) {
      return res.status(404).json({ message: "Region not found" });
    }

    await region.destroy();

    return res.status(204).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
