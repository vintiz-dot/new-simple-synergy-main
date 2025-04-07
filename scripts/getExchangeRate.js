// getExchangeRate.js
export const getExchangeRate = async () => {
    const url = 'https://v6.exchangerate-api.com/v6/b06accadc952b828842ed555/latest/USD';
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data?.conversion_rates?.NGN || null;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      return null;
    }
  };
  