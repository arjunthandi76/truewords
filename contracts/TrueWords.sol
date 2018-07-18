pragma solidity ^0.4.18;

contract TrueWords {
  // custom types
  struct Message {
    uint id;
    address source;
    string sourceName;
    string subject;
    string message;
    bool isPublic;
    uint256 revealAtTime;
    // @TODO: Add AlertTo array of users who should be alerted after reveal time
  }

  // state variables
  mapping (uint => Message) public messages;
  uint messageCounter;

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

    // store this message
    messages[messageCounter] = Message(
      messageCounter,
      msg.sender,
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
}
