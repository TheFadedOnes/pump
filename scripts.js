// Define the GraphQL Endpoint
const GRAPHQL_ENDPOINT_URL = 'https://YOUR_GRAPHQL_ENDPOINT_HERE';

// Define Queries
const queries = {
  topTokensQuery: `
    {
      Solana {
        DEXTrades(
          limitBy: { by: Trade_Buy_Currency_MintAddress, count: 1 }
          orderBy: { descending: Trade_Buy_Price }
          where: {
            Trade: { Dex: { ProtocolName: { is: "pump" } } }
            Transaction: { Result: { Success: true } }
          }
        ) {
          Trade {
            Buy {
              Price
              Currency {
                Name
                Symbol
              }
            }
          }
        }
      }
    }
  `,
  realTimeTradesQuery: `
    subscription {
      Solana {
        DEXTrades(
          where: {
            Trade: { Dex: { ProtocolName: { is: "pump" } } }
            Transaction: { Result: { Success: true } }
          }
        ) {
          Instruction {
            Program {
              Method
            }
          }
          Trade {
            Dex {
              ProtocolFamily
              ProtocolName
            }
            Buy {
              Amount
              Currency {
                Name
                Symbol
              }
            }
          }
          Transaction {
            Signature
          }
        }
      }
    }
  `,
  tokenVolumeQuery: `
    query {
      Solana {
        DEXTradeByTokens(
          where: {
            Transaction: { Result: { Success: true } }
          }
        ) {
          Trade {
            Currency {
              Name
              Symbol
            }
          }
        }
      }
    }
  `
};

// Function to Run Query
async function runQuery(queryKey) {
  const query = queries[queryKey];
  try {
    const response = await fetch(GRAPHQL_ENDPOINT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const result = await response.json();
    displayResults(result);
  } catch (error) {
    console.error('Error running query:', error);
    displayResults({ error: 'Failed to fetch data. Check console for details.' });
  }
}

// Function to Display Results
function displayResults(data) {
  const resultsElement = document.getElementById('queryResults');
  resultsElement.textContent = JSON.stringify(data, null, 2);
}
