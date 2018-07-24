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
      // get the contract artifact file and use it to instantiate a truffle contract abstraction
      App.contracts.TrueWords = TruffleContract(trueWordsArtifact);
      // set the provider for our contracts
      App.contracts.TrueWords.setProvider(App.web3Provider);
      // retrieve the messages from the contract
      return App.reloadMessages();
    });
  },

  reloadMessages: function() {
    // refresh account information because the balance might have changed
    App.displayAccountInfo();

    // retrieve the message placeholder and clear it
    $('#messagesRow').empty();

    App.contracts.TrueWords.deployed().then(function(instance) {
      return instance.getMessage();
    }).then(function(message) {
            console.log(message);
      if(message[0] == 0x0) {
        // no message
        return;
      }
      console.log(message[0]);
      // retrieve the message template and fill it
      var messageTemplate = $('#messageTemplate');
      messageTemplate.find('.panel-title').text(message[2]);
      messageTemplate.find('.message-description').text(message[3]);

      var source = message[0];
      if (source == App.account) {
        source = "You";
      }
      messageTemplate.find('.message-source').text(source);

      // add this message
      $('#messagesRow').append(messageTemplate.html());
    }).catch(function(err) {
      console.error(err.message);
    });
  },

  postMessage: function() {
    // retrieve the detail of the message
    var _source = $('#message_source').val();
    var _message_subject = $('#message_subject').val();
    var _description = $('#message_description').val();

    if((_message_subject.trim() == '')) {
      // nothing to post
      return false;
    }

    App.contracts.TrueWords.deployed().then(function(instance) {
      return instance.postMessage(_source, _message_subject, _description, true, 1513937410,{
        from: App.account,
        gas: 500000
      });
    }).then(function(result) {
      App.reloadMessages();
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
