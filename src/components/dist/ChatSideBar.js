"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var link_1 = require("next/link");
var button_1 = require("./ui/button");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("@/lib/utils");
var ChatSideBar = function (_a) {
    var chats = _a.chats, chatId = _a.chatId;
    return (react_1["default"].createElement("div", { className: 'w-full h-screen p-4 text-white bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900' },
        react_1["default"].createElement(link_1["default"], { href: '/' },
            react_1["default"].createElement(button_1.Button, { className: 'w-full border-dashed border-gray-200 border mb-4 cursor-pointer' },
                react_1["default"].createElement(lucide_react_1.PlusCircleIcon, { className: 'mr-2 w-4 h-4' }),
                "New Chat")),
        react_1["default"].createElement("div", { className: 'w-full flex-1 mr-2' }, chats.map(function (chat) { return (react_1["default"].createElement(link_1["default"], { key: chat.id, href: "/chat/" + chat.id },
            react_1["default"].createElement("div", { className: utils_1.cn('rounded-lg p-3 text-slate-400 flex items-center', {
                    "bg-blue-600 text-white": chat.id === chatId,
                    "hover:text-gray-400": chat.id !== chatId
                }) },
                react_1["default"].createElement(lucide_react_1.MessageCircleDashed, { className: 'mr-2 h-5 w-5 flex-shrink-0' }),
                react_1["default"].createElement("p", { className: 'w-full truncate text-sm font-medium whitespace-nowrap text-ellipsis' }, chat.pdfName)))); })),
        react_1["default"].createElement("div", { className: 'absolute bottom-10 left-4' },
            react_1["default"].createElement("div", { className: 'flex items-center gap-2 text-sm text-red-300 flex-wrap' },
                react_1["default"].createElement(link_1["default"], { href: "/" }, "Home"),
                react_1["default"].createElement(link_1["default"], { href: "/" }, "Source")))));
};
exports["default"] = ChatSideBar;
