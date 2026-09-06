const express = require("express");

const {
  User,
  Product,
  Order
} = require("./models");

const {
  hashPassword,
  comparePassword,
  createToken,
  authenticate,
  requireAdmin
} = require("./auth");

const router = express.Router();


// LOGIN
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const valid = await comparePassword(
      password,
      user.password
    );

    if (!valid) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = createToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Login failed"
    });
  }
});


// REGISTER
router.post("/auth/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user"
    });

    const token = createToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Registration failed"
    });
  }
});


// GET PRODUCTS
router.get("/products", async (req, res) => {
  try {
    const search = req.query.search || "";

    const products = await Product.find({
      name: {
        $regex: search,
        $options: "i"
      }
    });

    res.json(products);

  } catch (error) {
    res.status(500).json({
      message: "Could not load products"
    });
  }
});


// ADD PRODUCT - ADMIN
router.post(
  "/products",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const product = await Product.create(req.body);

      res.status(201).json(product);

    } catch (error) {
      res.status(400).json({
        message: "Could not create product"
      });
    }
  }
);


// UPDATE PRODUCT - ADMIN
router.put(
  "/products/:id",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      res.json(product);

    } catch (error) {
      res.status(400).json({
        message: "Could not update product"
      });
    }
  }
);


// DELETE PRODUCT - ADMIN
router.delete(
  "/products/:id",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);

      res.json({
        message: "Product deleted"
      });

    } catch (error) {
      res.status(400).json({
        message: "Could not delete product"
      });
    }
  }
);


// CREATE ORDER
router.post(
  "/orders",
  authenticate,
  async (req, res) => {
    try {
      const { items } = req.body;

      let total = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findById(item.product);

        if (!product) {
          return res.status(404).json({
            message: "Product not found"
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Not enough stock for ${product.name}`
          });
        }

        total += product.price * item.quantity;

        orderItems.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price
        });

        product.stock -= item.quantity;

        await product.save();
      }

      const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        total
      });

      res.status(201).json(order);

    } catch (error) {
      res.status(500).json({
        message: "Could not create order"
      });
    }
  }
);


// USER ORDERS
router.get(
  "/orders",
  authenticate,
  async (req, res) => {
    const orders = await Order
      .find({ user: req.user._id })
      .populate("items.product");

    res.json(orders);
  }
);


// ADMIN ALL ORDERS
router.get(
  "/admin/orders",
  authenticate,
  requireAdmin,
  async (req, res) => {
    const orders = await Order
      .find()
      .populate("user")
      .populate("items.product");

    res.json(orders);
  }
);


// ADMIN UPDATE ORDER STATUS
router.put(
  "/admin/orders/:id",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status
        },
        {
          new: true
        }
      );

      res.json(order);

    } catch (error) {
      res.status(400).json({
        message: "Could not update order"
      });
    }
  }
);

module.exports = router;
