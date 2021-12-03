# **Dashboard**

## **Authors**

- pierre.perrin@epitech.eu
- yohann.cormier@epitech.eu

## **General considération**

The goal of this projet is to build a complete dashboard with multiple widgets on multiple services (spotify / twitter / facebook...).

The client must be able to link his services with 2Oauth.
A refresh timer must be present for the widgets.

- The Client is available on ```http://localhost:3000/```
- Server is available on ```http://localhost:8080/```
- Mongo Admin is available on ```http://localhost:8081/```

## **Docker**

To build the project -> ```docker-compose build```
To run the project -> ```docker-compose up```

Client and Server have their own Dockerfile to build Reactjs and Nodejs environements

Docker compose at the root of the directory call them and expose them in the right port.
Docker compose also build mongo admin image.

He also build and sync the mongodb image used to store :
- User email
- User password
- User Tokens for each Api

## **Front-end**

We used ReactJS to develop the front end of our application.

Important librairies used : 
    - **MUI** (Material UI) -> For Design components like buttons or appbar
    - **react-grid-layout** -> Principal grid of the dashboard
    - **react-router**      -> To create client part routes (/register - /dashboard - /settings)
    - **Redux**             -> To store user email easily on client part
    - **Axios**             -> To do easier requests to server side

Folders description :
    - public                    ->  Html to call reactjs app
    - src                       ->  All the Reactjs app
    - src/views                 ->  All pages classed by file name
    - src/views/style           ->  All the css files used in views files
    - src/redux                 ->  Store and Reducer setup
    - src/components            ->  All the components needed for the client (widgets / grid)
    - src/components/widgets    ->  All the widgets classed by folder name and then file name

## **Back-end**

We used NodeJS / Express to develop the back-end of our application.

Important librairies used : 
    - **Dotenv**        -> To store api client_id and client_secret keys
    - **PassportJS**    -> To make 2OAuth authentifications with the services (Github / Spotify / Reddit / Google)
    - **bcryptjs**      -> To encrypt password in the database when creating users
    - **Snoowrap / github-api / spotify-web-api-node** -> Easier api calls and exceptions gesture to the different services

Folders description :
    - db            ->  Db creation and connection gesture
    - db/models     ->  User model setup
    - files         ->  about.json default file
    - routes        ->  All back-end routes used for the project
    - routes/api    ->  Routes for api calls 
    - routes/auth   ->  Routes for passport OAuth with the services
    - src           ->  Little usable function

