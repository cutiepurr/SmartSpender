const formatMoneyAmount = (amount) => {
    if (amount < 0) amount = `- $${-amount}`;
    else amount = `+ $${amount}`;
    return amount;
};

export {
    formatMoneyAmount
};