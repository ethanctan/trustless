const axios = require('axios');

// Step 1: Fetch Protocols from API
async function fetchProtocolData() {
  try {
    const response = await axios.get('http://localhost:3001/protocols');
    const protocolData = response.data;
    // console.log("protocol data:", protocolData);
    // Do something with protocolData here, or return it to use elsewhere
    return protocolData;
  } catch (error) {
    console.error('Error fetching protocols:', error);
  }
}

// Call the function to fetch the data
fetchProtocolData();


// Step 2: Instantiate Sigmoid Function

function sigmoid(x) {
  if (x > 15) {
    return 0;
  }
  else if (0 <= x <= 15) {
    return 1 / (1 + Math.exp(0.55*x-5));
  }
}

// Step 3: Calculate Scores for Each Wallet
// Caveat: Must delete all rankings between epochs
const scoresByWallet = {};

async function calculateScores(walletId, protocolData) {
  const temp = [];
  
  for (const protocol of protocolData) {
    try {
      // Fetch user rating for this wallet and protocol
      const response = await axios.get(`http://localhost:3001/ratings/${walletId}/${protocol.protocolName}`);
      const userRating = response.data;
      
      // If userRating is null, skip the rest of this iteration
      if (!userRating.isFound) {
        // console.log("continuing")
        continue;
      }
      console.log("user rating:", userRating.rating.scores)
      console.log("user rating sum:", userRating.rating.scores[0])
      console.log("protocol avgScore:", protocol.averageScore)
      // Calculate the distance for this protocol
      const dist = Math.sqrt(
        Math.pow(userRating.rating.scores[0] - protocol.averageScore, 2) + 
        Math.pow(userRating.rating.scores[1] - protocol.averageScore, 2) + 
        Math.pow(userRating.rating.scores[2] - protocol.averageScore, 2) + 
        Math.pow(userRating.rating.scores[3] - protocol.averageScore, 2) + 
        Math.pow(userRating.rating.scores[4] - protocol.averageScore, 2)  
      );
      console.log("dist:", dist)
      // Add this distance to our temporary array
      temp.push(dist);
      
    } catch (error) {
      console.error('Error fetching user rating:', error);
    }
  }
  
  // Compute the average of the distances for this wallet
  const averageDist = temp.reduce((a, b) => a + b, 0) / temp.length;
  
  // Store this average in the dictionary (object) under the current walletId
  console.log("average dist:", averageDist)
  console.log("sigmoid dist:", sigmoid(averageDist))
  scoresByWallet[walletId] = sigmoid(averageDist);
}


// This will fetch protocol data, then calculate scores
async function main() {
  const protocolData = await fetchProtocolData();
  await calculateScores('0xa4775bAf967701d876CAAb5E1E55B695c608F2F0', protocolData);
  console.log(scoresByWallet);
}

// Call the main function to start the process
main();
