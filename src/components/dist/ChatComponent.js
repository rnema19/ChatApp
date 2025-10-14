"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_2 = require("@ai-sdk/react");
var react_3 = require("react");
var button_1 = require("./ui/button");
var lucide_react_1 = require("lucide-react");
var MessageList_1 = require("./MessageList");
var ai_1 = require("ai");
var input_1 = require("./ui/input");
var ChatComponent = function (_a) {
    var chatId = _a.chatId;
    var _b = react_2.useChat({
        transport: new ai_1.DefaultChatTransport({
            api: '/api/chat',
            body: { chatId: chatId }
        })
    }), messages = _b.messages, sendMessage = _b.sendMessage;
    var _c = react_3.useState(''), input = _c[0], setInput = _c[1];
    function handleInputChange(e) {
        setInput(e.target.value);
    }
    function handleSubmit(e) {
        e.preventDefault();
        if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
        }
    }
    react_1.useEffect(function () {
        var messageContainer = document.getElementById("message-container");
        if (messageContainer) {
            messageContainer.scrollTo({
                top: messageContainer.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);
    return (react_1["default"].createElement("div", { className: 'relative h-full w-full overflow-auto p-2 bg-gradient-to-r from-yellow-200 via-green-200 to-green-300 flex flex-col', id: 'message-container' },
        react_1["default"].createElement("div", { className: 'py-2 bg-blue-950 text-white font-bold text-center rounded-lg text-xl mb-2' }, "Chat"),
        react_1["default"].createElement("div", null,
            react_1["default"].createElement(MessageList_1["default"], { messages: messages })),
        react_1["default"].createElement("div", { className: 'relative bottom-0 left-0 right-0 bg-white border-2 border-gray-400 rounded-lg flex justify-center p-1 max-w-full' },
            react_1["default"].createElement("form", { onSubmit: function (e) {
                    return handleSubmit(e);
                }, className: 'flex items-center flex-3' },
                react_1["default"].createElement(input_1.Input, { value: input, onChange: function (e) { return handleInputChange(e); }, placeholder: 'Shoot your questions...', className: 'flex-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500' }),
                react_1["default"].createElement(button_1.Button, { className: 'bg-blue-700 ml-1 mr-1 hover:bg-violet-950' },
                    react_1["default"].createElement(lucide_react_1.Send, { className: 'h-4 w-4' }))))));
};
exports["default"] = ChatComponent;
