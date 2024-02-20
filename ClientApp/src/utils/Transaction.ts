import { toDatetimeLocalInputDate } from "./DateExtensions";
import {CategoryItem} from "@/utils/Category";
interface FormTransaction {
    id?: number,
    email: string;
    description: string;
    amount: number | undefined;
    amountSign: string;
    categoryId: string | undefined;
    timestamp: string; // for datetime-local input
}

/**
 * Used for sending/receiving requests via api/Transactions
 */
interface ApiTransaction {
    id?: number,
    email: string;
    description: string;
    amount: number;
    timestamp: string;
    categoryId: number | undefined;
    category?: CategoryItem
}

const apiToFormTransaction = (transaction: ApiTransaction) => {
    const formTransaction: FormTransaction = {
        id: transaction.id,
        email: transaction.email,
        description: transaction.description,
        amount: Math.abs(transaction.amount),
        amountSign: transaction.amount >= 0 ? "+" : "-",
        categoryId: transaction.categoryId?.toString(),
        timestamp: toDatetimeLocalInputDate(new Date(transaction.timestamp))
    }
    
    return formTransaction;
}

const formToApiTransaction = (transaction: FormTransaction) => {
    let amount = transaction.amount;
    if (amount != undefined && transaction.amountSign === "-") amount = -amount;
    
    const apiTransaction: ApiTransaction = {
        id: transaction.id,
        email: transaction.email,
        description: transaction.description,
        amount: amount ?? 0,
        timestamp: new Date(transaction.timestamp).toLocaleString("sv").replace(" ", "T"),
        categoryId: parseInt(transaction.categoryId ?? "0"),
    };
    
    console.log(apiTransaction.timestamp)
    
    return apiTransaction;
}

export {
    type FormTransaction,
    type ApiTransaction,
    apiToFormTransaction,
    formToApiTransaction
}
