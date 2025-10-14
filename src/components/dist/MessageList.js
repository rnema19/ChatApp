'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var utils_1 = require("@/lib/utils");
var MessageList = function (_a) {
    var messages = _a.messages;
    if (!messages || messages.length === 0) {
        return (react_1["default"].createElement("div", { className: "text-center text-gray-500 py-8" }, "No messages to display!"));
    }
    // Helper function to get message content
    var getMessageContent = function (message) {
        if (message.content)
            return message.content;
        if (message.parts) {
            return message.parts.map(function (part) { return part.text || part.content || ''; }).join('');
        }
        return 'No content';
    };
    return (react_1["default"].createElement("div", { className: 'flex flex-col gap-3 px-4 py-2 h-full max-w-full overflow-auto ' }, messages.map(function (message, index) { return (react_1["default"].createElement("div", { key: message.id || index, className: utils_1.cn("flex max-w-full", {
            "justify-end": message.role === "user",
            "justify-start": message.role === "assistant"
        }) },
        react_1["default"].createElement("div", { className: utils_1.cn("rounded-lg px-3 py-2 text-sm shadow-md max-w-xs lg:max-w-md break-words", {
                "bg-blue-600 text-white": message.role === "user",
                "bg-gray-200 text-black ": message.role === "assistant"
            }) },
            react_1["default"].createElement("div", { className: "text-xs opacity-70 mb-1 font-medium" }, message.role === 'user' ? 'You' : 'AI'),
            react_1["default"].createElement("div", null, getMessageContent(message))))); })));
};
exports["default"] = MessageList;
