const convertToUSD = (tag, profit, rate) =>
{return tag === "CRYPTO" ? Math.round((profit * rate) * 100) / 100 : Math.round((profit / rate) * 100) / 100};

const convertToUSDWithUSD = (tag, profit, rate) =>
{return tag === "CRYPTO" ? Math.round((profit * rate) * 100) / 100 + ' USDT' : Math.round((profit / rate) * 100) / 100 + ' USD'};

export { convertToUSD, convertToUSDWithUSD };