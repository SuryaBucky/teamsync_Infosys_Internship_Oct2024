const ReplyBox = ({ message, onSendReply, onCancelReply }) => (
  <div className="bg-gray-200 p-3 rounded-lg mt-2">
    <p className="text-sm font-semibold text-gray-700">Replying to {message.creator_id}</p>
    <p className="text-sm text-gray-500">{message.content}</p>
    <textarea
      value={message.content}
      onChange={(e) => onSendReply(e.target.value)}
      className="w-full border border-gray-300 p-2 mt-2 rounded-lg"
      placeholder="Type your reply..."
    />
    <div className="flex space-x-2 mt-2">
      <button
        onClick={onSendReply}
        className="bg-blue-950 text-white rounded-full px-6 py-2"
      >
        Send Reply
      </button>
      <button
        onClick={onCancelReply}
        className="bg-gray-500 text-white rounded-full px-6 py-2"
      >
        Cancel
      </button>
    </div>
  </div>
);

export default ReplyBox
