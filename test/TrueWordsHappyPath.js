var TrueWords = artifacts.require("./TrueWords.sol");

// test suite
contract('TrueWords', function(accounts){
  var trueWordsInstance;
  var source = accounts[1];
  var revealTo = accounts[2];
  var messageSubject1 = "message 1";
  var messageSourceName1 = "Source name 1";
  var messageDescription1 = "Description for message 1";
  var messagePrice1 = 10;
  var messageIsPublic1 = true;
  var messageRevealTime1 = 1513937410;
  var messageSubject2 = "message 2";
  var messageDescription2 = "Description for message 2";
  var messagePrice2 = 20;
  var sourceBalanceBeforeBuy, ssourceBalanceAfterBuy;
  var revealToBalanceBeforeBuy, revealToAfterBuy;

  it("should be initialized with empty values", function() {
    return TrueWords.deployed().then(function(instance) {
      trueWordsInstance = instance;
      return trueWordsInstance.getNumberOfMessages();
    }).then(function(data) {
      assert.equal(data.toNumber(), 0, "number of messages must be zero");
      return trueWordsInstance.getPublicMessages();
    }).then(function(data){
      assert.equal(data.length, 0, "there shouldn't be any messages posted");
    });
  });

  // post first message
  it("should let us sell a first message", function() {
    return TrueWords.deployed().then(function(instance){
      trueWordsInstance = instance;
      return trueWordsInstance.postMessage(
        messageSourceName1,
        messageSubject1,
        messageDescription1,
        messageIsPublic1,
        messageRevealTime1
      );
    }).then(function(receipt){
      // check event
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      assert.equal(receipt.logs[0].event, "LogPostMessage", "event should be LogPostMessage");
      assert.equal(receipt.logs[0].args._id.toNumber(), 1, "id must be 1");
      assert.equal(receipt.logs[0].args._subject, messageSubject1, "event subject name must be " + messageSubject1);
      return trueWordsInstance.getNumberOfMessages();
    }).then(function(data) {
      assert.equal(data, 1, "number of messages must be one");

      return trueWordsInstance.getPublicMessages();
    }).then(function(data) {
      assert.equal(data.length, 1, "there must be one message posted");
      assert.equal(data[0].toNumber(), 1, "message id must be 1");

      return trueWordsInstance.messages(data[0]);
    }).then(function(data) {
      assert.equal(data[0].toNumber(), 1, "Message id must be 1");
      assert.equal(data[3], messageSubject1, "message name must be " + messageSubject1);
      assert.equal(data[4], messageDescription1, "Message description must be " + messageDescription1);
    });
  });
});
