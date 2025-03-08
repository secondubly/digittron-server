"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { Routes, Route } from 'react-router'
// import { HomePage } from './pages/Home'
// import { LoginPage } from './pages/Login'
// import "./App.css"
// import IndexButton from './componnts/IndexButton'
const react_router_1 = require("react-router");
const Home_1 = require("./pages/Home");
const Login_1 = require("./pages/Login");
const Setup_1 = require("./pages/Setup");
const App = () => {
    return (<react_router_1.BrowserRouter>
			<div id="nav">
				<react_router_1.Link to="/">home</react_router_1.Link>
				<react_router_1.Link to="/login">login</react_router_1.Link>
				<react_router_1.Link to="/setup">setup</react_router_1.Link>
				<react_router_1.Link to="/">playlist viewer</react_router_1.Link>
			</div>
			<react_router_1.Routes>
				<react_router_1.Route path="/" element={<Home_1.HomePage />}/>
				<react_router_1.Route path="/setup" element={<Setup_1.SetupPage />}/>
				<react_router_1.Route path="/login" element={<Login_1.LoginPage />}/>
			</react_router_1.Routes>
		</react_router_1.BrowserRouter>);
};
exports.default = App;
