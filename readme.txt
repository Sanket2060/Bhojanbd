 video: How to setup a professional backend project 


 ->Use code file_name to create multiple files/single file from terminal.
 Two types of importing:
 1.Common JS
 2.Module 
 We use Module

Devdependencies->dependencies used only at development.

 Nodemon->Everytime you change the code at server,your server needs to be  stopped  and started.So,nodemon does that for us.
 Prettier->When not used same format and code merging is done it creates problems.So,prettier provides us to have same type 
 of writing when added as dev dependencies.
Default gitignore for node->Take from any website from google  https://mrkandreev.name/snippets/gitignore-generator/
 Remaining to add gitignore for node JS

 Creating folder with terminal in windows??->Don't know
 chatgpt summary: https://chat.openai.com/share/17eb84f6-0836-41c5-adbe-5825d9c2fcc1


 video: How to connect database in MERN with debugging:
  What you need to connect to mongodb from atlas:allowed ip address,correct id password and url
  ->Arranging env file and .env.sample accordingly.

  Defining database name at constants.js so that at changes we don't have to change the whole file

  Ifies=>Special function to run when compiled syntax: ;(async ....function)()
  Connecting to database mustn't happen at single line.
  "Database is at another continent" =>async await

  Environment variable changes then nodemon can do nothing about that.You have to restart server by yourself.i.e.npm run dev

  dotenv extension and it's installation???
  ->this extension provides the code to get env variables as soon as possible.But this extension has 'require' statement to import which 
  makes inconsistency.So,to make the import by 'import' statement,we follow few things

  i  homework->What does connection instance console logs??
  -> connectionInstance is the result of the mongoose.connect() method, which returns a Mongoose connection instance
        //contains properties and methods to interact with the database.

    // //The process.exit(1) line is typically used to stop the execution of the program in case the database connection fails.



  video:  CUSTOM API RESPONSE AND ERROR HANDLING video:
  Why doesn't app has to be imported (created at app.js) to use it??
  Providing additional callback to app.js???->To show server is running rightly message
    5:40 assignment->Done
    app.use is for middleware configurations

    Configuring cors from npm cors

    Managing data coming to backend:
    1.By body:For forms   
app.use(express.json({limit:"16kb"}))  //how much of  json data is limited by limit key
    2.By params:using url
app.use(express.urlencoded({limit:"16kb",extended:true}))
  3.Keeping files such as images,favicon at server itself:
app.use(express.static("public"));

app.use(express.cookieparser());

Use asyncHandler to write a covering of async await try catch rather than writing for each and every time:
->By async await and try catch

Standarized(same) api errors and responses:
ApiResponse.js and ApiError.js

Assignment: What does this.data field have in node JS????

Chatgpt link:https://chat.openai.com/share/0cc64f01-4c9b-45e3-92bc-5657e5ea0d8a

