# Socket-Events Documentation

## Server-To-Client

#### Error-Events

```
1. user-error - {general errors}
2. game-error - {errors specific to ongoing game}
Format :-
{
    title: "",
    msg: "",
    buttonText: "",
    redirectTo: ""
}
```

#### Game-Events

```
1. color - {sending piece color to player}
Format :-
    color: ""

2. players-info - {sending information of players to room}
Format :-
[{
    id: "",
    color: "",
    username: "",
    photo: ""
}]

3. winner - {sending the winner of the game to the room}
Format :-
    winner: "" (color of the piece)

4. draw-offered
Format :-

5. draw-accepted
Format :-

6. draw-rejected
Format :-

7. end-game - {ends the game and makes the players & spectators leave the board}
Format :-
```

#### Game-Status-Events

```
1. games - {sends list of all ongoing games, except bot games}
Format :-
[{
    id: "",
    playerCount: __
}]

2. game-status - {sends the current state of board after each move}
Format :-
{
    id: "",
    board: [][]
    turn: ""
}

3. ongoing-game - {sends the ongoing game user is a player of}
Format :-
{
    id: "",
    turn: "",
    players: [{}]
}
```

## Client-To-Server

#### Game-Initiation-Events

```
1. create-game
Format :-
(
    isBot: bool,
    botLevel: Number,
    color: "",
    mandatoryMoves: bool,
    isRated: bool,
    token: ""
)

2. join-game
Format :-
(
    gameId: "",
    token: ""
)

3. random-play-guest
Format :-
(
    mandatoryMoves: bool,
    guestId: ""
)

4. random-play-user
Format :-
(
    mandatoryMoves: bool,
    token: ""
)
```

#### Game-Events

```
1. move-piece
Format :-
{
    selectedPiece : {x : Number, y : Number},
    destination : {x : Number, y : Number}
}

2. quit-game
Format :-

3. leave-room
Format :-
{
    roomId: ""
}

4. draw-offered
Format :-

5. draw-accepted
Format :-

6. draw-rejected
Format :-

7. send-msg
Format :-
{
    gameId: "",
    msg: ""
}

8. opponent-video-ready
Format :-
{
    peerId: "",
    gameId: ""
}
```
