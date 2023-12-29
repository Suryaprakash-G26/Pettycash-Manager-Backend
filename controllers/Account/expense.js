import { Expense } from "../../schema/expense.js";

export async function Getallexpenses(userId){
    return Expense.find({userId:userId})
}

export function NewExpense(data){
    return Expense(data).save()
}

export async function getexpense(id){
    return Expense.findOne({_id:id})
}

export async function deleteexpense(id){
    return Expense.deleteOne({_id:id})
}

export async function editExpense(id, data) {
    return Expense.updateOne({ _id: id }, { $set: data });
  }
  