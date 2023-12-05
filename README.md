# Memelandia - Your Memes, Your Way

Welcome to Memelandia, a platform that empowers users to create, share, and engage with memes effortlessly. Memelandia provides a seamless experience, allowing users to express their creativity, interact with content, and build a vibrant meme community.

## Table of Contents

1. [Overview](#overview)
2. [Demo](#demo)
3. [User Permissions](#user-permissions)
4. [Deployment](#deployment)
5. [Application Architecture](#application-architecture)
6. [Screenshots](#screenshots)
7. [License](#license)
8. [Client Readme](https://github.com/TodorYadkov/Memelandia_App_React/blob/main/client/README.md) (Opens in a new tab)
9. [Server Readme](https://github.com/TodorYadkov/Memelandia_App_React/blob/main/server/README.md) (Opens in a new tab)

## Overview

Memelandia enables users to:

-   Create and post memes
-   Like, dislike, comment, and add memes to favorites
-   Share memes with a shortened, uniform link
-   Access external APIs for jokes and meme templates
-   Explore top-rated memes on the home page
-   Manage user profiles with personal statistics
-   Rate memes based on user interactions

## Demo

Check out the live demo of MemeLandia at [https://memelandia.vercel.app/](https://memelandia.vercel.app/)

For a quick exploration, you can use the following demo accounts:

-   **Demo User 1:**

    -   Username: mem4o
    -   Email: peter@abv.bg
    -   Password: 123456

-   **Demo User 2:**
    -   Username: jonathan
    -   Email: john@abv.bg
    -   Password: 123456

## User Permissions

-   **Not-Logged User:**

    -   View all memes
    -   Use search functionality
    -   View all memes of a specified user

-   **Logged-In User (Not Owner):**

    -   Like, dislike, comment on memes
    -   Add memes to favorites
    -   Share memes

-   **Logged-In User (Owner):**
    -   Edit and delete own memes
    -   Share memes

## Deployment

### Backend Deployment

The backend of MemeLandia is deployed on [Vercel](https://vercel.com/). The backend handles the core functionalities, including user authentication.

### Frontend Deployment

The React frontend of Memelandia is deployed on [Vercel](https://vercel.com/). Vercel serves the frontend to users and provides a seamless browsing experience.

### Database

The MongoDB database used for MemeLandia is hosted on [MongoDB Cloud](https://cloud.mongodb.com). MongoDB Cloud ensures reliable and scalable data storage for the application.

### Cloud Storage for Memes

MemeLandia utilizes [ImgBB](https://imgbb.com/) as the cloud storage provider for saving memes. ImgBB provides a reliable and efficient solution for handling image uploads, ensuring a smooth experience for users.

To integrate ImgBB into your project:

1. **Sign up for an ImgBB account:** Visit [ImgBB](https://imgbb.com/) and create an account.

2. **Get API Key:** Obtain your ImgBB API key from your account settings.

3. **Configure Environment Variables:** Set up your project's environment variables and include the ImgBB API key for seamless integration.

## Application Architecture

The following application architecture diagram is generated using [dependency-cruiser](https://github.com/sverweij/dependency-cruiser). It visually represents the dependencies within the project.

Explore the live flow of the Memelandia App architecture by visiting the [Live Flow Page](https://todoryadkov.github.io/Memelandia_App_React_Live_Flow_Architecture/)

![Architecture from dependency-cruiser](/client/dependency-graph-main.svg)
![Memelandia_App_React_client_high-level-dependencies](https://github.com/TodorYadkov/Memelandia_App_React/assets/4013980/b5f29627-783a-4522-b2fe-96131c37c853)

For a detailed analysis of dependencies, you can run dependency-cruiser in your project. To get started, visit the [dependency-cruiser on NPM](https://www.npmjs.com/package/dependency-cruiser)

## Screenshots

### Desktop

#### Home Page - Top three rated memes

![Home Page](https://github.com/TodorYadkov/Memelandia_App_React/assets/4013980/9671b565-b2f8-4f60-851c-69719e3b5850)

#### Memeboard Page - Display the Latest Memes with infinite scroll pagination

![Memeboard Page](https://github.com/TodorYadkov/Memelandia_App_React/assets/4013980/8ea4e942-8282-47a8-94ec-e2a74c83160a)

#### Login Page - Display the highest rated meme

![Login Page](https://github.com/TodorYadkov/Memelandia_App_React/assets/4013980/f70872aa-e273-4fa6-86f6-eac5547551a6)

#### Register Page - Display the second highest rated meme

![Register Page](https://github.com/TodorYadkov/Memelandia_App_React/assets/4013980/55c05f9e-0193-4a7c-8219-5ded0615cb82)

#### About Page

![About Page](https://github.com/TodorYadkov/Memelandia_App_React/assets/4013980/66dc0888-1766-4c3a-a0cd-f37d7a995d84)

#### Create Page

![Create Page](https://github.com/TodorYadkov/Memelandia_App_React/assets/4013980/12f74d18-484c-418c-9fc4-51b053b98cc7)

#### Profile Page

![Profile Page](https://github.com/TodorYadkov/Memelandia_App_React/assets/4013980/61b9ed7f-725c-4f15-bfbf-83fd197de12d)

### Mobile

#### Home Page - Top three rated memes

![Home Page - Mobile](https://github.com/TodorYadkov/Memelandia_App_React/assets/4013980/8e34e952-35e6-4188-b395-49d9b1427af8)

#### Memeboard Page - Display the Latest Memes with infinite scroll pagination

![Memeboard Page - Mobile](https://github.com/TodorYadkov/Memelandia_App_React/assets/4013980/e96a3d4c-cc9c-4fcb-99ed-6cfee8a073b4)

#### Login Page - Shows the highest rated meme

![Login Page - Mobile](https://github.com/TodorYadkov/Memelandia_App_React/assets/4013980/4b305d89-00cb-410f-85f1-7c3043a1009c)

#### Register Page - Shows the second highest rated meme

![Register Page - Mobile](https://github.com/TodorYadkov/Memelandia_App_React/assets/4013980/6e19e81d-2e9b-4139-9a40-c167200da652)

#### About Page

![About Page - Mobile](https://github.com/TodorYadkov/Memelandia_App_React/assets/4013980/b2aabdec-e4f5-42f7-bac0-df7b825a7b94)

#### Create Page

![Create Page - Mobile](https://github.com/TodorYadkov/Memelandia_App_React/assets/4013980/b81f8ddf-1a4b-4a29-b641-e1012b8027a5)

#### Profile Page

![Profile Page - Mobile](https://github.com/TodorYadkov/Memelandia_App_React/assets/4013980/7383d464-ba2d-46e3-8f70-31fb9c813037)

# License

This project is licensed under the MIT License
