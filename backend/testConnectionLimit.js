// const axios = require('axios');

// const URL = 'http://localhost:5000/api/users'; // Change to your endpoint
// const REQUESTS = 5; // Number of parallel requests

// async function testConnectionLimit() {
//   const promises = [];
//   for (let i = 0; i < REQUESTS; i++) {
//     promises.push(
//       axios.get(URL)
//         .then(res => console.log(`Request ${i + 1}: Success`))
//         .catch(err => {
//           if (err.response) {
//             console.log(`Request ${i + 1}:`, err.response.data);
//           } else {
//             console.log(`Request ${i + 1}: Error`, err.message);
//           }
//         })
//     );
//   }
//   await Promise.all(promises);
// }

// testConnectionLimit();


const axios = require('axios');

const URL = 'http://localhost:5000/api/users'; // Protected endpoint
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNzU1Nzc0MTIwLCJleHAiOjE3NTU3Nzc3MjB9.Pnz6JlFMc2TJgVqeU1sguFGj__yzEmwwPE9jEk4_SRo"; // Paste your JWT token here
const REQUESTS = 5;

async function testConnectionLimit() {
  const promises = [];
  for (let i = 0; i < REQUESTS; i++) {
    promises.push(
      axios.get(URL, {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      })
      .then(res => console.log(`Request ${i + 1}: Success`))
      .catch(err => {
        if (err.response) {
          console.log(`Request ${i + 1}:`, err.response.data);
        } else {
          console.log(`Request ${i + 1}: Error`, err.message);
        }
      })
    );
  }
  await Promise.all(promises);
}

testConnectionLimit();