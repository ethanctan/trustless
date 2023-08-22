const axios = require('axios');
const { fetchProtocolData } = require('../utils/apis');

// Step 1: Instantiate Sigmoid Function

function sigmoid(x) {
  if (x > 15) {
    return 0;
  }
  else if (0 <= x <= 15) {
    return 1 / (1 + Math.exp(0.55*x-5));
  }
}

// Step 2: Calculate Scores for Each Wallet
// Caveat: Must delete all rankings between epochs

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
  
      // Calculate the distance for this protocol
      const dist = Math.sqrt(
        Math.pow(userRating.rating.scores[0] - protocol.averageScore, 2) + 
        Math.pow(userRating.rating.scores[1] - protocol.averageScore, 2) + 
        Math.pow(userRating.rating.scores[2] - protocol.averageScore, 2) + 
        Math.pow(userRating.rating.scores[3] - protocol.averageScore, 2) + 
        Math.pow(userRating.rating.scores[4] - protocol.averageScore, 2)  
      );
      // console.log("dist:", dist)
      // Add this distance to our temporary array
      temp.push(dist);
      
    } catch (error) {
      console.error('Error fetching user rating:', error);
    }
  }
  
  // Compute the average of the distances for this wallet
  if (temp.length == 0) {
    console.log("No ratings")
    return 0;
  }
  else {
    const averageDist = temp.reduce((a, b) => a + b, 0) / temp.length;
    // Store this average in the dictionary (object) under the current walletId
    console.log("average dist:", averageDist)
    console.log("sigmoid dist:", sigmoid(averageDist))
    return sigmoid(averageDist);
  }

}


// This will fetch protocol data, then calculate scores
async function calculateRatingMultiplier(userWallet) {
  const protocolData = await fetchProtocolData();
  let res = await calculateScores(userWallet, protocolData);
  return res
}

//export 
module.exports = {
  calculateRatingMultiplier
};

