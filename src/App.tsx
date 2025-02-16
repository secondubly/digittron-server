import './App.css'
import IndexButton from './components/IndexButton'

const oauth_url = "https://id.twitch.tv/oauth2/authorize?client_id=y9a5yor736cry2i0taeu0y4t11nj7f&force_verify=true&redirect_uri=http://localhost:5173&response_type=token&scope=bits:read+channel:manage:broadcast+channel:edit:commercial+channel:manage:polls+channel:manage:predictions+channel:manage:raids+channel:manage:redemptions+channel:moderate+channel:read:hype_train+channel:read:polls+channel:read:predictions+channel:read:redemptions+channel:read:subscriptions+moderation:read+moderator:manage:announcements+moderator:manage:automod+moderator:manage:banned_users+moderator:manage:chat_messages+moderator:manage:chat_settings+moderator:manage:shield_mode+moderator:manage:shoutouts+moderator:read:blocked_terms+moderator:read:chatters+moderator:read:followers+moderator:read:moderators+moderator:read:unban_requests+moderator:read:vips"
function App() {

  return (
    <>
      <div>
        <IndexButton url="/" title='Control Panel' />
        <IndexButton url="/" title='Song Request Playlist' />
        <IndexButton url ={oauth_url} title='Bot Setup' />
      </div>
    </>
  )
}

export default App
