# mobut-project

This project is a digital version of the game tag! 

It is build with Firebase, PubNub, Google Maps, Google GeoLocation API as well as Google Authentication Through the Firebase SDK. 

## Requirements

The following tools/frameworks are needed to run/develop this project

* npm & node.js
* Firebase CLI 

### Installing dependencies and running the app locally

* Install dependencies with: `npm install`
* Run the app locally with: `npm run start`
* Build the app with: `npm run build`

#### Firebase commands

To use any firebase commands you need to install the Firebase CLI: 
   
`npm install -g firebase-tools`

* To deploy the app first make sure you're logged in (with google account):
  
    `firebase login`

    then run 

    `npm run deploy`


## Design

The application was designed with Onsen UI. When writing this, it looks as following: 
![](app-design.png?raw=true)


## Architecture

The application is build according the diagram showed below. 

* It uses React.js for the client and Onsen UI for the user interface. 
* The game view is using Google Maps to display the users location and the direction to the target player. 
* PubNub is used to broadcast the users location data among the clients/players
* The backend includes a database in Firebase as well as google Authentication and Hosting provided from Firebase. 

![](component-diagram.png?raw=true)

## Video

[Demo video of the app (Old design)](https://drive.google.com/open?id=1MCsAe0nd03wCqdalXvZgbI6fpgQ3Hu97)