# User Management and Post CRUD with MongoDB

This web application provides CRUD (Create, Read, Update, Delete) functionality for both posts and comments. Users can perform the following actions:

- Posts Management: Create, view, update, and delete posts.
- Comments Management: Comment on existing posts, view comments, update comments, and delete comments.
- User Authentication: Users can register for a new account, log in with existing credentials, and reset their password if forgotten.

## Feature

- User Registration: `POST /api/user/register` .
- User Login: `POST /api/user/login`.
- Password Reset: `POST /api/user/forgot-password`.
- Post Create: `POST /api/post/create`
- Update Post : `POST /api/post/update/:slug`
- Delete Post : `POST /api/post/delete/:slug`

## Prerequisites

- Node.js installed on your machine
- MongoDb installed on your machine

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/ayushi-jain08/node-assignment

   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   **Create a .env file in the root directory with the following variables:**

```bash
   PORT = 5050
   CONNECTION = mongodb+srv://ayushijain08:********@cluster0.******.mongodb.net/node-assignmemnt
   SECRET_KEY = ayusijainismynameandimstudyinbcomhons
   EMAIL = ayushijain0807@gmail.com
   PASS = =************
   NAME = ayushicoder
   KEY = 132166264294926
   SECRET = ************



```

5. Start the backend server:

   ```bash
   node ./index.js
   ```

   `OR`

   ```bash
   nodemon ./index.js
   ```

   The server will start at `http://localhost:5050`.

   ## Folder Structure

### Backend

```
.
├── controllers
│   ├── user.js             # Logic of user controllers
│   ├── post.js              # Logic of post controllers
│   └── comment.js          # Logic of comment controllers
│
├── routes
│   ├── user.js             # Logic of user routes
│   ├── post.js              # Logic of post routes
│   └── comment.js          # Logic of comment routes
│
├── Model
│   ├── user.js             # user schema
│   ├── post.js              # post schema
│   └── comment.js          # comment schema
│
├── utils
│   ├── cloudinary.js            # uploading images on cloudinary
│   ├── validator.js            # validation logic of controller function
│   ├── email.js           # Nodemailer logic to send OTP via email
│   ├── pino.js             # pino logic to save and logger and maintains the records of all logs
│   ├── otpGen.js           # OTP generation logic
│   └── ErrorValidator.js            # Error handling logic
│
├── middleware
│   └── auth.js             #  Logic of all middleware
│
├── templates
│   └── mailTemplate.js     # Custom HTML and CSS mail template for Nodemailer
│
├── .config.js 
│   ├── mongodb.js           # Mongodb database connection 
│   └── httpConstant.js      # all status code  
|     
│
├── index.js              # logics of express server and assemble all module to cuppling with each other
|
├── .env                    # Contains confidential keys
├── .gitignore              # Git logic to ignore files
├── package.json            # Contains all the packages information
└── README.md               # Documentation of code

