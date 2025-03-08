"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupPage = void 0;
const OauthButton_1 = require("../components/OauthButton");
const SCOPE_LIST = [
    "bits:read",
    "channel:manage:broadcast",
    "channel:edit:commercial",
    "channel:manage:polls",
    "channel:manage:predictions",
    "channel:manage:raids",
    "channel:manage:redemptions",
    "channel:moderate",
    "channel:read:hype_train",
    "channel:read:polls",
    "channel:read:predictions",
    "channel:read:redemptions",
    "channel:read:subscriptions",
    "moderation:read",
    "moderator:manage:announcements",
    "moderator:manage:automod",
    "moderator:manage:banned_users",
    "moderator:manage:chat_messages",
    "moderator:manage:chat_settings",
    "moderator:manage:shield_mode",
    "moderator:manage:shoutouts",
    "moderator:read:blocked_terms",
    "moderator:read:chatters",
    "moderator:read:followers",
    "moderator:read:moderators",
    "moderator:read:unban_requests",
    "moderator:read:vips",
];
const SetupPage = () => {
    return (<>
			<div className="header">
				<header>Digittron Setup</header>
			</div>
			<p>
				In order to setup the bot dashboard for use, you will need to
				authenticate it so that it's allowed in your twitch chat, and allow the
				dashboard permission to access your Twitch account. To do so, you simply
				need to click the button below to allow it access to your twitch chat.
				Please make sure that you have given digittron moderator permissions in
				your server. To do so you can use the following chat command:{" "}
				<code role="text" aria-label="twitch command to promote digittron to moderator status">
					/mod digittron
				</code>
			</p>
			<OauthButton_1.OauthButton host={"https://id.twitch.tv"} clientID={import.meta.env.VITE_TWITCH_CLIENT_ID} redirectURL={window.location.origin} scope={SCOPE_LIST}/>
		</>);
};
exports.SetupPage = SetupPage;
