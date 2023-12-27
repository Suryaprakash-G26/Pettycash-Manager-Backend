import express from "express";
import {
    Getallexpenses,
  NewExpense,
  deleteexpense,
  editExpense,
  getexpense,
} from "../controllers/Account/expense.js";
import moment from "moment";

const router = express.Router();

// All expenses

router.get("/allexpenses", async (req, res) => {
  try {
    const userId = req.body.userId;

    //get expenses
    const data= await Getallexpenses(userId);
    if(!data){
       return res.status(404).json("details not found");
    }
    res.status(200).json({ data});
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

//Add expenses

router.post("/addexpense", async (req, res) => {
  try {
    // Checking if the details are filled
    if (Object.keys(req.body).length <= 0) {
      return res
        .status(400)
        .json({ error: "Invalid request, Enter the details" });
    }

    // Validation
    const { title, category, price, quantity, description, date } = req.body;

    if (!title || !category || !price || !quantity || !description || !date) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }
    //total price
    const totalPrice = quantity * price;

    //getting user id
    const userId = req.body.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "User not authenticated  Kindly Login again" });
    }

    const newdata = { userId, ...req.body, totalPrice };
    await NewExpense(newdata);

    res.status(200).json({ data: "Expense added successfully", newdata });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

//delete expense
router.delete("/deleteexpense/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.body.userId;

    //check product
    const expense = await getexpense(userId, id);

    // if expense doesnt exist
    if (!expense) {
      res.status(404).json("details not found");
    }
    // delete the item
    const deleted = await deleteexpense(id);
    // checking whether deleted or not
    if (!deleted) {
      res.status(500).json({ error: "Failed to delete expense" });
    }

    res.status(200).json({ data: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

// edit expense
router.put("/editexpense/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.body.userId;

    //check product
    const expense = await getexpense(userId, id);

    // if expense doesnt exist
    if (!expense) {
      res.status(404);
      throw new Error("Product not found");
    }

    //update edited
    const edited={...req.body}

    //check for the totalprice
    if(edited.totalPrice!=edited.quantity*edited.price){
        const newPrice = edited.quantity * edited.price;
        edited.totalPrice = newPrice;
    }

    //save in DB
   const updateddata= await editExpense(id,edited)


    res.status(200).json({ data: "Expense Edited and updated successfully",updateStatus:updateddata.acknowledged });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

export const expenseRouter = router;
