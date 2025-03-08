"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationLink = void 0;
const react_1 = __importDefault(require("react"));
const NavigationLink = ({ title, url, }) => {
    return <a href={url}>{title}</a>;
};
exports.NavigationLink = NavigationLink;
