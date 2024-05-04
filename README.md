# example-webserver
This is a simple web server for training purpose. When it is started, it will can be accessed at http://localhost:3000. The following pages are served by the web server:
1. Login page - (/) user should be able to login with username and password. If user does not have an account yet, clcik the *Register* button to register an account.
2. Register page - (/register) user should be able to register an account with a new username and password.
3. Info form page - (/info) user will be presented with an information form where it will ask a little bit of user details.
4. User information page - (/user-info) user will be presented with the information entered in the info form.

User details are stored in the data.json file, and will be readable with any text editor. User password will also be stored in the file in a plain text format. When the application starts up, if the data.json file is missing, it will create an empty data.json file. If the data.json file exists, it will load it up to memory. If the data.json file is corrupted, please delete the file, so the application can create a new version.

## Prerequisites
1. NodeJS (18 or above)

## Start web server
Follow the steps below to start the web server. The web server will then listen on port 3000 (http://localhost:3000).

1. Clone the repository
2. Install the node packages
```bash
npm install
```
3. Start the web server
```bash
npm start
```
