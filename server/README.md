# API DOCUMENTATION

## Format

````
1. /api/auth/oauth/google

   - request
     ```json
     ```
   - response
     ```json
     ```
   - error
     ```json
     ```

````

### Auth Routes

1. /api/auth/signup

   - request
     ```json
     {
       "email": "",
       "password": ""
     }
     ```
   - response
     ```json
     {
       "success": true,
       "token": ""
     }
     ```
   - error
     ```json
     {
       "err": [
         {
           "value": "gupthan849.com",
           "msg": "Invalid Email...",
           "param": "email",
           "location": "body"
         }
       ],
       "success": false
     }
     ```

2. /api/auth/signin

   - request
     ```json
     {
       "email": "",
       "password": ""
     }
     ```
   - response
     ```json
     {
       "success": true,
       "token": ""
     }
     ```
   - error

     ```json
     {
       "success": false,
       "err": "email and password does not match"
     }
     ```

     ```json
     {
       "err": [
         {
           "value": "guptaishn849gmail.com",
           "msg": "Email field required...",
           "param": "email",
           "location": "body"
         }
       ],
       "success": false
     }
     ```

3. /api/auth/oauth/google

   - response

     ```json
     {
       "success": true,
       "token": ""
     }
     ```

     catch /api/auth/oauth/google/callback request

4. /api/auth/oauth/facebook

   - response

     ```json
     {
       "success": true,
       "token": ""
     }
     ```

     catch /api/auth/oauth/facebook/callback request
