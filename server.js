const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const Customer = require("./src/models/customer");

const app = express();

mongoose.set("strictQuery", false);

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("welcome");
});

// all customers
app.get("/api/customers", async (req, res) => {
  try {
    const results = await Customer.find();
    res.json({ customers: results });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

// find single customer
app.get("/api/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      res.status(404).json({ msg: "User not found" });
    } else {
      res.status(200).json({ customer });
    }
  } catch (e) {
    res.status(400).json({ msg: "Something went wrong" });
  }
});

// update customer
app.put("/api/customers/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.replaceOne({ _id: customerId }, req.body);
    res.json({ updatedCount: result.modifiedCount });
  } catch (e) {
    res.status(400).json({ msg: "Something went wrong" });
  }
});

// add customer
app.post("/api/customers", async (req, res) => {
  const { name, industry } = req.body;
  const customer = new Customer({
    name: name,
    industry: industry,
  });
  try {
    await customer.save();
    res.status(201).json({ customer });
  } catch (e) {
    console.log(e.message);
    res.status(400).json(e.message);
  }
});

// delete a customer
app.delete("/api/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Customer.deleteOne({ _id: id });
    if (!result) {
      res.status(404).json({ msg: "Customer not found" });
    } else {
      res.json({ deletedCount: result.deletedCount });
    }
  } catch (e) {
    res.status(400).json({ msg: "Something went wrong" });
  }
});

app.post("/", (req, res) => {
  res.send("send post request");
});

const start = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION);

    app.listen(process.env.PORT || 3000, () => {
      console.log(`App is running on port ${process.env.PORT || 3000}`);
    });
  } catch (e) {
    console.log(e.message);
  }
};

start();

// mongodb+srv://nkarodza:hozleO5UShrbtr5u@nodeing.b2ugwcf.mongodb.net/
