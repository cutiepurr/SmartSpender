import { toDatetimeLocalInputDate } from "./DateExtensions";
interface FormTransaction {
    id?: number,
    email: string;
    description: string;
    amount: number;
    amountSign: string;
    category: number;
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
    categoryID: number;
}

const apiToFormTransaction = (transaction: ApiTransaction) => {
    const formTransaction: FormTransaction = {
        id: transaction.id,
        email: transaction.email,
        description: transaction.description,
        amount: Math.abs(transaction.amount),
        amountSign: transaction.amount >= 0 ? "+" : "-",
        category: transaction.categoryID,
        timestamp: toDatetimeLocalInputDate(
            new Date(`${transaction.timestamp}.000Z`)
        )
    }
    
    return formTransaction;
}

const formToApiTransaction = (transaction: FormTransaction) => {
    let amount = transaction.amount;
    if (transaction.amountSign === "-") amount = -amount;
    
    const apiTransaction: ApiTransaction = {
        id: transaction.id,
        email: transaction.email,
        description: transaction.description,
        amount: amount,
        timestamp: new Date(transaction.timestamp).toISOString(),
        categoryID: transaction.category,
    };
    
    return apiTransaction;
}

export {
    FormTransaction,
    ApiTransaction,
    apiToFormTransaction,
    formToApiTransaction
}
