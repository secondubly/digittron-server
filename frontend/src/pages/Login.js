"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const react_1 = __importDefault(require("react"));
const react_router_1 = require("react-router");
const LoginPage = () => {
    const navigate = (0, react_router_1.useNavigate)();
    const onSubmit = (event) => {
        event.preventDefault();
        navigate("/");
    };
    return (<>
			<div>Login</div>
			<form onSubmit={onSubmit}>
				<div>
					username: <input />
				</div>
				<div>
					password: <input type="password"/>
				</div>
				<button type="submit">login</button>
			</form>
		</>);
};
exports.LoginPage = LoginPage;
