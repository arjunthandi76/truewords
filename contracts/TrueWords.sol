pragma solidity ^0.4.18;

contract TrueWords {

  address source;
  string sourceName;
  string sourceSubject;
  string sourceDescription;

  // custom types
  struct Message {
    uint id;
    address source;
    string sourceName;
    string sourceSubject;
    string sourceMessage;
    bool isPublic;
    uint256 revealAtTime;
    // @TODO: Add AlertTo array of users who should be alerted after reveal time
  }

  // state variables
  mapping (uint => Message) public messages;
  uint messageCounter;

  // constructor
  function TrueWords() public {
    postMessage("Arjun", "Default message", "This is a message set by default", true, 123);
  }

  // events
  // LogPostMessage
  event LogPostMessage(
    uint indexed _id,
    address indexed _source,
    string _subject,
    string _message,
    uint256 _revealTime
  );

  // post a message
  function postMessage(string _sourceName, string _subject, string _message, bool _isPublic, uint256 _revealAtTime) public {
    // a new message
    messageCounter++;
    source = msg.sender;
    sourceName = _sourceName;
    sourceSubject = _subject;
    sourceDescription = _message;

    // store this message
    messages[messageCounter] = Message(
      messageCounter,
      source,
      _sourceName,
      _subject,
      _message,
      _isPublic,
      _revealAtTime
    );

    LogPostMessage(messageCounter, msg.sender, _subject, _message, _revealAtTime);
  }

  // fetch the number of messages in the contract
  function getNumberOfMessages() public view returns (uint) {
    return messageCounter;
  }

  // fetch and return all public message IDs
  function getPublicMessages() public view returns (uint[]) {
    // prepare output array
    uint[] memory messageIds = new uint[](messageCounter);

    uint numberOfPublicMessages = 0;
    // iterate over messages
    for(uint i = 1; i <= messageCounter;  i++) {
      if(messages[i].isPublic) {
        messageIds[numberOfPublicMessages] = messages[i].id;
        numberOfPublicMessages++;
      }
    }

    // copy the messageIds array into a smaller displayPublicMessages array
    uint[] memory displayPublicMessages = new uint[](numberOfPublicMessages);
    for(uint j = 0; j < numberOfPublicMessages; j++) {
      // @TODO: return messages with an omitted message text where reveal date is less then current time
      displayPublicMessages[j] = messageIds[j];
    }
    return displayPublicMessages;
  }

  // get a message
  function getMessage() public view returns (
    address _source,
    string _sourceName,
    string _subject,
    string _message
  ) {
      return(source, sourceName, sourceSubject, sourceDescription);
  }
}
