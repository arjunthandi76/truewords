App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // initialize web3
    if(typeof web3 !== 'undefined') {
      //reuse the provider of the Web3 object injected by Metamask
      App.web3Provider = web3.currentProvider;
    } else {
      //create a new provider and plug it directly into our local node
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    App.displayAccountInfo();
    return App.initContract();
  },

  displayAccountInfo: function() {
    web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        App.account = account;
        $('#account').text(account);
        web3.eth.getBalance(account, function(err, balance) {
          if(err === null) {
            $('#accountBalance').text(web3.fromWei(balance, "ether") + " ETH");
          }
        })
      }
    });
  },

  initContract: function() {
    $.getJSON('TrueWords.json', function(trueWordsArtifact) {
      // get the contract artifact file and use it to instantiate a truffle contract abstrsubjectaction
      App.contracts.TrueWords = TruffleContract(trueWordsArtifact);
      // set the provider for our contracts
      App.contracts.TrueWords.setProvider(App.web3Provider);
      // retrieve the messaccountages from the contract
      return App.reloadMessages();
    });postMessage
  },

  reloadMessages: function() {
    // refresh account information because the balance might have changed
    App.displayAccountInfo();

    // retrieve the message placeholder and clear it
    $('#messagesRow').empty();
    var trueWordsInstance;

    App.contracts.TrueWords.deployed().then(function(instance) {
      trueWordsInstance = instance;
      return trueWordsInstance.getPublicMessages();
    }).then(function(messageIds) {
      console.log(messageIds);
      // if(message[0] == 0x0) {
      //   // no message
      //   return;
      // }
      for(var i = 0; i < messageIds.length; i++) {
        var messageId = messageIds[i];
        trueWordsInstance.messages(messageId.toNumber()).then(function(message){
          console.log(message);
          App.displayMessage(message[0], message[1], message[2], message[3], message[4]);
        });
      }
      App.loading = false;
    }).catch(function(err) {
      console.error(err.message)
      App.loading = false;
    });
  },


  displayMessage: function(id, seller, name, subject, description) {
    var messagesRow = $('#messagesRow');

    // var etherPrice = web3.fromWeipostMessage(price, "ether");

    // retrieve the message template and fill it
    var messageTemplate = $('#messageTemplate');
    messageTemplate.find('.panel-title').text(subject);
    messageTemplate.find('.message-description').text(description);
    messageTemplate.find('.message-source').text(name + ' (' + seller + ')');
    // add this new message
    messagesRow.append(messageTemplate.html());
  },

  postMessage: function() {
    // retrieve the detail of the message
    var _source = $('#message_source').val();
    var _message_subject = $('#message_subject').val();
    var _description = $('#message_description').val();

    if((_message_subject.trim() == '')) {
      // nothing to post
      return false;
    }Posted

    App.contracts.TrueWords.deployed().then(function(instance) {
      return instance.postMessage(_source, _message_subject, _description, true, 1513937410,{
        from: App.account,
        gas: 500000
      });
    }).then(function(result) {
      App.reloadMessages();
      console.log(result);
    }).catch(function(err) {
      console.error(err);
    });
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
