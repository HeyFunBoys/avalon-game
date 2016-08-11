import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import game from '../scripts/game.js';

import socketListeners from '../util/socketEventListeners';

class Game extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {
    var socket = this.props.socket;
    socketListeners.AllListeners(socket);
  }
  componentDidMount() {
    game.init();
    function randomHexColor() {
      var hred = (Math.floor(Math.random() * 180) + 20).toString(16);
      var hgreen = (Math.floor(Math.random() * 180) + 20).toString(16);
      var hblue = (Math.floor(Math.random() * 180) + 20).toString(16);

      return Number('0x' + (hred + hgreen + hblue).toUpperCase());
    }

    //Connect to server
    var socket = this.props.socket;
    var userColor = randomHexColor();
    socket.emit('userColor', userColor);
      

    //Add peers who were already in the game
    socket.on('allPeers', function(players) {
      for (let p in players) {
        game.addPlayer(players[p].uid, players[p].color);
      }
    });
    //Add in new peer to the game
    socket.on('newPeer', function(player) {
      game.addPlayer(player.uid, player.color);
      // Later connect new peer's audio
      // var conn = peer.connect(uid);

      // conn.on('open', function(){
      //   conn.send('hey newbie');
      //   conn.on('data', function(data){
      //     console.log('(old)Received some greetings:', data);
      //   });
      // });
    });
    // peer.on('connection', function(conn){
    //   conn.on('data', function(data){
    //     console.log('(new)Received some greetings:', data);
    //   });
    //   conn.send('Hey gramps!');
    // });
    socket.on('peerLeft', function(uid) {
      game.removePlayer(uid);
    });
  }
  partyLeaderPickParty() {
    this.props.socket.emit('pickParty', ['player1', 'player2', 'player3']);
  }
  voteOnParty() {       
    this.props.socket.emit('voteOnParty', true);
  }
  voteOnQuest() {
    this.props.socket.emit('voteOnQuest', true);
  }
  pickMerlin() {
    this.props.socket.emit('stabMerlin', 'player');
  }
  render() {
    return (
      <div> 
        <h1>THREE GAME</h1>
        <div id="gameContainer"></div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    //currentUser: state.currentUser
  };
}
function mapDispatchToProps(dispatch) {
  return {
    //login: bindActionCreators(login, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
//export default Game;


