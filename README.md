# spot-me
This is a revisit of a node.js application that I made for a university hackathon.

Before running this make sure you have npm installed.
If you don't you can download it [here](https://www.npmjs.com/get-npm)

With this projected cloned and with your cd set to the root of this project.
Run `npm i`
Then run `npm start`

The endpoints are:

POST `/user/create` which creates an account

POST `/user/login` which logs in and provides a json webtoken for authentication

POST `/user/logout` which logs out a single json web token

POST `/user/logoutAll` which logs out all active json web tokens

GET `/user` which returns account details of authenticated account

POST `/transaction/lend` which charges the authenicated lender and adds the captured amount to the borrower's account

POST `/transaction/disburse` which disburses a specified amount from the authenticated user.

