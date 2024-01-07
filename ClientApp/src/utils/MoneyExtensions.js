const formatMoneyAmount = (amount, positiveSign=true) => {
    if (amount < 0) amount = `- $${-amount}`;
    else if (positiveSign) amount = `+ $${amount}`;
    else amount = `$${amount}`;
    return amount;
};

export {
    formatMoneyAmount
};