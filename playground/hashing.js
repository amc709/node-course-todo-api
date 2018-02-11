const {SHA256} = require('crypto-js');

const jwt = require('jsonwebtoken');  // cf. https://jwt.io
const bcrypt = require('bcryptjs');  //cf bryptjs npm

var password = '123abc!x';

// // 10 is no. of rounds/passes made in generating the salt
// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) =>{
//     console.log(hash);
//   });
// });

var hashedPassword = '$2a$10$MChBuaunmVo54YlkhoJKF.UK1oq5uwBV0nx/cJ90Ly8vBtQ/0w58i';

bcrypt.compare(password, hashedPassword, (err, res) =>{
  console.log(res);
});

// var data = {
//   id: 10
// }
//
// var token =jwt.sign(data, '123abc');  // 2nd param is the secret salt
// console.log('token: ', token);
//
// var decoded = jwt.verify(token, '123abcd');
// console.log('decoded: ', decoded);
//
// // var message = 'I am user number 3';
// // var hash = SHA256(message).toString();
// //
// // console.log(`Message:  ${message}`);
// // console.log(`Hash:  ${hash}`);
// //
// // var data = {
// //   id: 4
// // };
// //
// // var token = {
// //   data,
// //   hash:  SHA256(JSON.stringify(data) + 'somesecretkeytosaltthehash').toString()
// // };
// //
// // // If id was changed
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
// // console.log(`updated token hash: ${token.hash}`);
// //
// //
// // // This shows how salting the hash keeps the integrity of the token since
// // // it adds to the generated hash.  If the data object is changed (e.g. id
// // // is changed), the resulting hash will now be different.  When compared to the
// // // originally generated hash, it will prove that it has changed.
// // var resultHash = SHA256(JSON.stringify(token.data) + 'somesecretkeytosaltthehash').toString();
// // if (resultHash === token.hash){
// //   console.log("Data was not changed");
// // } else {
// //   console.log('Data was changed. Do not trust!')
// // }
