import * as firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBXCX1Bb5S3OeJSmPsGr9B2J6iS9LVs2pQ",
    authDomain: "mobut-project.firebaseapp.com",
    databaseURL: "https://mobut-project.firebaseio.com",
    projectId: "mobut-project",
    storageBucket: "mobut-project.appspot.com",
    messagingSenderId: "685766846531",
    appId: "1:685766846531:web:39b5f7b9d38e6c22fdccf6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Listener for the players in the lobby
let lobbyListener;



function addPlayerToLobby(player_object) {
    let player_id = player_object.playerId;
    // player_name.replace(/\s/g, '_');
    return firebase.firestore().collection('lobby').doc(player_id).set({
        playerName: player_object.playerName,
        playerId: player_object.playerId,
        imgURL: player_object.imgURL,
        email: player_object.email,
        ready: false
    })
        .catch(function (error) {
            console.error('Error adding a player to the lobby', error);
        });
}

function stopListeningToLobby() {
    if (lobbyListener !== undefined) {
        lobbyListener();
    }
}

function ListenToPlayersInLobby(callback) {
    lobbyListener = firebase.firestore().collection("lobby").onSnapshot(function (querySnapshot) {
        var playersInLobby = [];
        querySnapshot.forEach(function (doc) {
            playersInLobby.push(doc.data());
        });
        callback(playersInLobby);
    }, function onError(error) {
        console.error("Error listening to lobby: ", error);
    });
}

function ListenToPlayersInGame(callback) {
    lobbyListener = firebase.firestore().collection("games").onSnapshot(function (querySnapshot) {
        var playersInGame = [];
        querySnapshot.forEach(function (doc) {
            playersInGame.push(doc.data());
        });
        callback(playersInGame);
    }, function onError(error) {
        console.error("Error listening to lobby: ", error);
    });
}

async function getPlayersInLobby() {
    var playersInLobby = [];
    await firebase.firestore().collection("lobby").get().then(querySnapshot => {
        querySnapshot.forEach(function (doc) {
            playersInLobby.push(doc.data());
        });
    });
    console.log('Players', playersInLobby);
    return playersInLobby;
}

function getPlayersInGame(game_id) {
    return firebase.firestore().collection("games").doc(game_id).get();
}

function removePlayerFromLobby(player_object) {
    let player_id = player_object.playerId;
    firebase.firestore().collection("lobby").doc(player_id).delete().then(function () {
        console.log("Player succesfully removed from LOBBY!");
    }).catch(function (error) {
        console.error("Error removing lobby: ", error);
    });
}

function removePlayerFromGame(player_object) {
    let player_id = player_object.playerId;
    firebase.firestore().collection("games").doc(player_id).delete().then(function () {
        console.log("Player succesfully removed from GAME!");
    }).catch(function (error) {
        console.error("Error removing game: ", error);
    });
}


function removePlayersInLobby(playersInLobby) {
    playersInLobby.forEach(function (player) {
        removePlayerFromLobby(player.playerId);
    });
}

function addPlayerToNewGame(player_object, callback) {
    let player_id = player_object.playerId;
    firebase.firestore().collection('games').doc(player_id).set({
        playerName: player_object.playerName,
        playerId: player_object.playerId,
        imgURL: player_object.imgURL,
        email: player_object.email,
        ready: false
    })
        .then(function (docRef) {
            removePlayerFromLobby(player_object);
            callback();
        })
        .catch(function (error) {
            console.error('Error adding players to new game', error);
        });
}

function removeAllPlayersInGame(playersInLobby) {
    playersInLobby.forEach(function (player) {
        removePlayerFromGame(player.playerId);
    });
}

function addPlayersToNewGame(playersInLobby) {
    firebase.firestore().collection('games').add({
        players: playersInLobby
    })
        .then(function (docRef) {
            console.log("Successfully added players to newly created game with ID: ", docRef.id);
            return playersInLobby;
        })
        .catch(function (error) {
            console.error('Error adding players to new game', error);
        });
}

function createNewGame() {
    return getPlayersInLobby()
        .then(function (lobby) {
            console.log('lobby :', lobby);
            var playersInLobby = [];
            lobby.forEach(function (doc) {
                playersInLobby.push(doc.data());
            });
            console.log("players in lobby:", playersInLobby);
            return playersInLobby;
        })
        .then(addPlayersToNewGame)
        .then(removePlayersInLobby)
        .catch(function (error) {
            console.error("Error creating a new game:", error);
        });

}

function setPlayerReadyStatus(player_id, status) {
    firebase.firestore()
        .collection('lobby')
        .doc(player_id)
        .update({
            ready: status
        })
        .catch((error) => {
            console.error('Error setting the player ready status', error);
        });

}

function createFakeLobby() {
    addPlayerToLobby("DJ COW", 'https://vignette.wikia.nocookie.net/pewdiepieminecraft/images/0/06/MushCow2.jpeg/revision/latest?cb=20190803151753');
    addPlayerToLobby("Bengt", 'https://vignette.wikia.nocookie.net/pewdiepieminecraft/images/e/e7/4C2C755B-FB01-4351-886E-077F5B03CF16.jpeg/revision/latest?cb=20190811175416');
    addPlayerToLobby("Sven", 'https://vignette.wikia.nocookie.net/pewdiepieminecraft/images/d/dd/Sven.png/revision/latest?cb=20191130204116');
    addPlayerToLobby("Sven's BF", 'https://vignette.wikia.nocookie.net/pewdiepieminecraft/images/b/ba/SvenYellow.jpeg/revision/latest?cb=20190814205003');
    addPlayerToLobby("Water Sheep", 'https://vignette.wikia.nocookie.net/pewdiepieminecraft/images/d/db/Water_Sheep%27s_Return.png/revision/latest?cb=20191129235246');
    addPlayerToLobby("Ulla Britta", 'https://vignette.wikia.nocookie.net/pewdiepieminecraft/images/6/6d/BCBBA22C-0452-4B35-8C67-52F8345D734F.jpeg/revision/latest?cb=20190805181119');
    addPlayerToLobby("Flip Flop", 'https://vignette.wikia.nocookie.net/pewdiepieminecraft/images/c/c7/Flip_Flop.jpeg/revision/latest?cb=20190922230718');
}

// TODO: any functions to handle the end of a game?

export {
    addPlayerToNewGame,
    createNewGame,
    ListenToPlayersInGame,
    addPlayerToLobby,
    createFakeLobby,
    removePlayerFromLobby,
    ListenToPlayersInLobby,
    getPlayersInLobby,
    setPlayerReadyStatus,
    stopListeningToLobby,
    removePlayerFromGame
};
