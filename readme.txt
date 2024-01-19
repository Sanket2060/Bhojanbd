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

🙌Video:How to connect frontend with Backend
-Using proxies instead of using https://localhost/..... everytime
- /api ma define garey /api ko agadi (http://......) haru append ta garxa nai ani server le
ni CORS error dinna🙋‍♀️❓39:00 ->Use of proxy resolves CORS error 🙋‍♀️❓


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


Video:Create user and video models with hooks(methods) and JWT
-Created user and video models.Data modeled them
-Got to know about schema's own methods(hooks):.pre and custom methods(by userSchema.method.method_name) 
-Bcrypt:Used to store password in hashed(encrypted) form and match password for authentication.What it does is it  hashes our password and checks for
-correct password between hashed password and pure password (for authentication purpose).
-JWT:JWT is a bearer token.It's like a key(chabi),we give data to the one who has this key(chabi).It's used for access and 
refresh tokens.
-Mongoose Aggregate Paginate:

-userSchema.pre("save",async function(next){      //arrow function can't be used.Why?? arrow function can't access schema(by this)
    if (this.isModified("password")) return next();
    this.password=bcrypt.hash(this.password,10);    //pre runs before data is set and this.password must be empty??
    next();                                                //hash rounds-10    //next as parameter for middleware
})

userSchema.methods.isPasswordCorrect = async function(password){  //custom methods to schema
       return   await  bcrypt.compare(password,this.password);  //this
}

-//pre and methods are from userSchema itself so they can have access to there data members.



Video:How to upload files in Multer
-Function to Upload on cloudanary 
-Multer:To store files temporarily on server until it is uploaded or canceled to upload on cloudanary
-Fs:Fs"file system"(from node JS) is used to link(add)  and Unlinking(deleting) video from our server
-Middlewares: Jaa rahe ho kahi toh mujse milke jana  -Hitesh Chaudary sir ,chai aur code 
  Chatgpt url:https://chat.openai.com/share/a80e7cc5-1b5f-471c-ac36-06204d76731f



Video:HTTP crash course
metadata:Data k bareme data
-HTTP Headers->contains metadata:key value pair sent along with response and request
Usecase:->Caching,authentication,manage state\
    X-prefix->2012 (X-Deprecated)
Types:->
Request Headers->from client
Response Headers->from server
Representation Headers->in which form data is there->encoding/compression
Payload headers->Data


Most common headers->
Accept:application/json
User-agent
Authorization
Content-type
Cookie
Cache-control


CORS(Cross Origin Resource Sharing):Defining at backend who can access the backend through url calling
-Access Control Allow Origin
-Access Control Allow credentials
-Access Control Allow method


Security
->Cross-Origin-Embedded-Policy
->Cross-Origin-Opener-Policy
->Content-Security-Policy
->X-XSS-Protection


HTTP Methods:
Basic set of operations that can be used to interact with server
GET:retrieve a resource
HEAD:No message body(response headers only)
OPTIONS:what operations are available
TRACE:loopback test(get same data)
DELETE:remove a resource
PUT:replace a resource
POST:interact with a resource(mostly add)
PATCH:change part of a resource



HTTP Status Code:
 1XX:Informational
 2XX:Success
 3XX:Redirection
 4XX:Client Error
 5XX:Servor Error


100->Continue               
102->Processing                   
200->Ok
201->Created
202->Accepted
307->temporarily redirect
308->permanently redirect     
400->Bad request
401->Unauthorized
402->Payment required
404->Not found
500->Internal Server Error
504->Gateway time out

Link:https://chat.openai.com/share/5e71c113-9e98-4d96-a68e-bcd7c377f7f7


Video:Complete guide for router and controller with debugging
async handler understanding???->Understood link: https://chat.openai.com/share/405a9448-496a-4403-8d9e-37c49c4810e0
-Understood how routing happens through multiple files
-Used postman to hit the created route.
-Sent json message and status(code) when hitting the route.
app.get ->used to hit url
app.use ->used to hit middleware
Summary url:https://chat.openai.com/share/59f265e7-3a76-47a5-9bc4-8fe9d62276d3


Video:Logic builiding|Register controller
-Always write algorithm for working.It builds logic and gives 'Divide and rule' to you.
-Extracting data from frontend passed of form or body->req.body
-throw new APIERROR(400,"fullname is required");
-.some usuage
-models can communicate with database (as they are from mongoose) and
-queries on database
-handling images
-console.log properties to know more i.e. what it really offers
---------------------------------------------------------------------------------------------------
*Adding middleware for files(multer middleware) 
*Checking to database through query (findOne )
*Adding data to database via data model
Refer to user.controller.js for all algorithm and for better understanding go for video 


Video:How to use postman for backend
->Sending data from body->formdata to api from postman
->How does codeflow works at backend?Like when is database connection made?What runs first when
a route is hit?? Links: https://chat.openai.com/share/b960e77f-0bb4-497d-aa0c-08b2a7df05f5
->removing files from server even on success by fs.unlink
->Using collections containing folder and making the url small
-> ?. v/s no ?  //????????


Video:Access Refresh Token,Middlewares and cookies in Backend
Access token:short lived    Refresh token:long lived
->Access token:for every access a token is created.//?????
->Refresh token for not hitting password again and again until they are same in user and database

User v/s user:Chatgpt links

Doubt.jpeg //????? -->>Understood
27:00  instance lisakexam tespaxi changes push garexam so hamro instance change huni vayena->Understood
32:30 object??? user: with so many values
  
 Middlewares Special:req and res are objects and when middlewares are added properties to req and res also gets added.
  Eg.multer is added as middleware we got req.files... .Also,cookieparser was added so we got res.cookie

 Creating our own Middleware:
 ->Just create function and add data to req.__variable or res.__variable to access it later.
 ->Use the middleware in the routes.
 ->Further learnt about JWT,verifying tokens
-------------------------------------------------------------------------------------------------- 
But access token or refresh token expiration not handeled yet
If res is not used then,you can use _(underscore).

Most important chatgpt links: 
https://chat.openai.com/share/fb07f8e6-a370-46c3-b5b4-d786fcb4c15e
https://chat.openai.com/share/3a514127-b285-4e26-8eb6-aeca5ff597de





Discord doubt





//Mongodb queries:findOne(),Create(),findById(),findByIdAndUpdate()
//Mongodb operators: &&,||,$set
//     user.refreshToken=refreshToken; //we can change current database detail by database instance
//   await  user.save({validateBeforeSave:false}) //to save the changes on instance and validateBeforeSave tells the code 

Mongodb queries:find(),find(),sort(-1 or 1),limit(number),


Errors at project::
invalid otp huda bahira ko catch block ko error send garirathyo (instead of "invalid otp" message from inside if...else)
Chatgpt link: https://chat.openai.com/share/e7aa1961-1c0d-4f75-bf4a-6d31c7678382