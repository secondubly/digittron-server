import React from 'react'
import { OauthButton } from '../components/OauthButton'

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
  "moderator:read:vips"
]

export const HomePage = () => {
  return (
    <>
      <div>Home</div>
      <OauthButton host={'https://id.twitch.tv'} clientID={import.meta.env.VITE_TWITCH_CLIENT_ID} redirectURL={window.location.origin} scope={SCOPE_LIST} />
    </>
  )
}