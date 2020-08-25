# spot-me
This is a revisit of a node.js application that I made for a university hackathon. It was originally used in conjunction with a front-end iOS app that allowed users to find nearby "spotters" (what we called our users) via Google Maps API. The app would also find ways for users to be incentivized to save money and have spare change to "spot" someone. The repo that you are looking at contains a REST API that is powered by Stripe to move money from one user account to another.

Before running this make sure you have npm installed.
If you don't you can download it [here](https://www.npmjs.com/get-npm)

You may need to acquire a Stripe account and some MongoDB manager to satisfy dependencies. Personally, I am using the dotenv package to manage local environment variables. Check dotenv out [here](https://www.npmjs.com/package/dotenv).

Now, With this project cloned and with your current directory set to the root of this project.

Run `npm i`

Then run `npm start`

## The endpoints are:
POST `/user/create` which creates an new account.

POST `/user/login` which logs in and provides a json webtoken for authentication and authorization to use other endpoints.

POST `/user/logout` which logs out a single json web token.

POST `/user/logoutAll` which logs out all active json web tokens.

GET `/user` which returns account details of authenticated user.

POST `/transaction/lend` which charges the authenticated lender and adds the captured amount to the borrower's account.

POST `/transaction/disburse` which disburses a specified amount from the authenticated user.

