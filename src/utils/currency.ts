import { Currency } from "../types/expense";
import { EXCHANGE_RATES } from "../constants";

export const convertAmount = (amount: number, fromCurrency: Currency, toCurrency: Currency): number => {
    if (fromCurrency === toCurrency) return amount;

    // Convert via XOF as base currency
    const normalizedFrom = fromCurrency === 'FCFA' ? 'XOF' : fromCurrency;
    const normalizedTo = toCurrency === 'FCFA' ? 'XOF' : toCurrency;

    if (normalizedFrom === normalizedTo) return amount;

    // Convert from anyway to XOF
    let amountInXOF = amount;
    if (normalizedFrom === 'EUR') amountInXOF = amount * EXCHANGE_RATES.EUR_TO_XOF;
    else if (normalizedFrom === 'USD') amountInXOF = amount * EXCHANGE_RATES.USD_TO_XOF;
    else if (normalizedFrom === 'GBP') amountInXOF = amount * EXCHANGE_RATES.GBP_TO_XOF;
    else if (normalizedFrom === 'CAD') amountInXOF = amount * EXCHANGE_RATES.CAD_TO_XOF;
    else if (normalizedFrom === 'JPY') amountInXOF = amount * EXCHANGE_RATES.JPY_TO_XOF;
    else if (normalizedFrom === 'CHF') amountInXOF = amount * EXCHANGE_RATES.CHF_TO_XOF;

    // Convert from XOF to target
    let result = amountInXOF;
    if (normalizedTo === 'EUR') result = amountInXOF * EXCHANGE_RATES.XOF_TO_EUR;
    else if (normalizedTo === 'USD') result = amountInXOF * EXCHANGE_RATES.XOF_TO_USD;
    else if (normalizedTo === 'GBP') result = amountInXOF * EXCHANGE_RATES.XOF_TO_GBP;
    else if (normalizedTo === 'CAD') result = amountInXOF * EXCHANGE_RATES.XOF_TO_CAD;
    else if (normalizedTo === 'JPY') result = amountInXOF * EXCHANGE_RATES.XOF_TO_JPY;
    else if (normalizedTo === 'CHF') result = amountInXOF * EXCHANGE_RATES.XOF_TO_CHF;

    return Math.round(result * 100) / 100; // Round to 2 decimals
};

export const formatAmount = (amount: number, currency: Currency): string => {
    if (currency === 'FCFA' || currency === 'XOF') {
        return Math.round(amount).toString();
    }
    return amount.toFixed(2);
};
