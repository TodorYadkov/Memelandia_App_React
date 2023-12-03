# Server Documentation

## Usage

To run the API, follow these steps:

1. **Clone the repository from GitHub:**

    ```bash
    git clone https://github.com/TodorYadkov/Memelandia_App_React.git
    ```

2. **Navigate to the server directory:**

    ```bash
    cd server
    ```

3. **Install the required dependencies using npm:**

    ```bash
    npm install
    ```

4. **Set up the environment variables:**

    - Create a `.env` file in the root directory of the project.
    - Add the following lines to the `.env` file, replacing the placeholder values:
        ```makefile
        PORT = <YOUR_PORT>
        CONNECTION_STRING = <DB_PATH>
        ROUNDS_BCRYPT = <10>
        JWT_SECRET = <YOUR_SECRET>
        IMGBB_KEY = <YOUR_IMGBB_API_KEY>
        IMGBB_API_URL = <IMGBB_API_URL>
        ```

5. **Start the server:**

    ```bash
    npm start
    ```

6. **Access the API:**
   The API will be available at `http://localhost:<YOUR_PORT>/`.

Now you're all set! If you encounter any issues or have questions, feel free to reach out. Happy coding!

-   [Technologies Used](#technologies-used)
-   [User Operations](#user-operations)
    -   [Register](#register)
    -   [Login](#login)
    -   [Logout](#logout)
    -   [Get User by ID](#get-user-by-id)
    -   [Update User](#update-user)
    -   [Forgotten Password](#forgotten-password)
    -   [Add/Remove Favorite Meme](#addremove-favorite-meme)
-   [Meme Operations](#meme-operations)
    -   [Get Top-Rated Memes](#get-top-rated-memes)
    -   [Get All Memes](#get-all-memes)
    -   [Get Meme by Search](#get-meme-by-search)
    -   [Get Meme by ID](#get-meme-by-id)
    -   [Get Memes for User by ID](#get-memes-for-user-by-id)
    -   [Add New Meme](#add-new-meme)
    -   [Update Meme](#update-meme)
    -   [Delete Meme](#delete-meme)
    -   [Add/Remove Like Meme](#addremove-like-meme)
    -   [Add/Remove Dislike Meme](#addremove-dislike-meme)
-   [Comment Operations](#comment-operations)
    -   [Add New Comment](#add-new-comment)
    -   [Get All Comments for Meme](#get-all-comments-for-meme)
    -   [Get Comment by ID](#get-comment-by-id)
    -   [Update Comment](#update-comment)
    -   [Delete Comment](#delete-comment)
-   [Pagination and Search Integration](#pagination-and-search-integration)
-   [Authorization](#authorization)
-   [Environment Variables](#environment-variables)

## Technologies Used

-   Node.js
-   Express.js
-   mongoose
-   jsonwebtoken
-   bcrypt
-   dotenv
-   joi
-   nodemon
-   axios

## User Operations

### Register

-   Endpoint: `users/register`
-   Method: POST

### Login

-   Endpoint: `users/login`
-   Method: POST

### Logout

-   Endpoint: `users/logout`
-   Method: GET

### Get User by ID

-   Endpoint: `users/profile`
-   Method: GET

### Update User

-   Endpoint: `users/profile`
-   Method: PUT

### Forgotten Password

-   Endpoint: `users/forgotten-password`
-   Method: PUT

### Add/Remove Favorite Meme

-   Endpoint: `users/favorite/:memeId`
-   Method: GET

## Meme Operations

### Get Top-Rated Memes

-   Endpoint: `memes/three-top-rated`
-   Method: GET

### Get All Memes

-   Endpoint: `memes?page=${pageNumber}&limit=${limitCount}`
    -   Method: GET
    -   Query Parameters: `page`, `limit`

### Get Meme by Search

-   Endpoint: `memes/search?name=${memeName}&category=${category}&page=${pageNumber}&limit=${limitCount}`
    -   Method: GET
    -   Query Parameters: `name`, `category`, `page`, `limit`

### Get Meme by ID

-   Endpoint: `memes/get-one/:memeId`
-   Method: GET

### Get Memes for User by ID

-   Endpoint: `memes/for-user/:userId?page=${pageNumber}&limit=${limitCount}`
    -   Method: GET
    -   Query Parameters: `page`, `limit`

### Add New Meme

-   Endpoint: `memes/create`
-   Method: POST

### Update Meme

-   Endpoint: `memes/edit/:memeId`
-   Method: PUT

### Delete Meme

-   Endpoint: `memes/delete/:memeId`
-   Method: DELETE

### Add/Remove Like Meme

-   Endpoint: `memes/like/:memeId`
-   Method: GET

### Add/Remove Dislike Meme

-   Endpoint: `memes/dislike/:memeId`
-   Method: GET

## Comment Operations

### Add New Comment

-   Endpoint: `memes/comments/:memeId`
-   Method: POST

### Get All Comments for Meme

-   Endpoint: `memes/comments/:memeId`
-   Method: GET

### Get Comment by ID

-   Endpoint: `memes/comments/get-one/:commentId`
-   Method: GET

### Update Comment

-   Endpoint: `memes/comments/edit/:commentId`
-   Method: PUT

### Delete Comment

-   Endpoint: `memes/comments/delete/:commentId`
-   Method: DELETE

## Pagination and Search Integration

The server has integrated paging and search functionalities, ensuring a smooth and efficient user experience. JSON objects are returned for ease of use.

Example response for paginated meme data:

```json
{
   {
    "memes": [
        {
            "_id": "6560b30685a36bd9b6a563e3",
            "name": "Awesome Meme",
            "imageUrl": "https://",
            "category": "Funny",
            "views": 0,
            "author": {
                "_id": "655408f33cf3548017984351",
                "username": "Peter"
            },
            "likes": [],
            "dislikes": [],
            "rating": 0,
            "createdAt": "2023-11-24T14:28:22.170Z",
            "updatedAt": "2023-11-24T14:28:22.170Z",
            "__v": 0
        }
    ],
    "page": 1,
    "totalPages": 1
}
}
```

## Authorization

To make an authorized request, include the `X-Authorization` header. The server utilizes JSON Web Tokens (JWT) for secure authentication.

## Environment Variables

Ensure the following environment variables are set in your `.env` file:

-   `PORT`
-   `CONNECTION_STRING`
-   `JWT_SECRET`
-   `ROUNDS_BCRYPT`
-   `IMGBB_KEY`
-   `IMGBB_API_URL`

The server also performs image uploads to the ImgBB cloud when creating memes.