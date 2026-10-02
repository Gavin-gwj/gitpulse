import { PinIcon, GithubMark } from './Icons.jsx';

export default function ProfilePanel(props) {
  const profile = props.profile;
  return (
    <div className="profile">
      <div className="profile__head">
        <img className="profile__avatar" src={profile.avatar} alt="" width="56" height="56" />
        <div className="profile__ident">
          <h1 className="profile__name">{profile.name}</h1>
          <p className="profile__handle">@{profile.login}</p>
        </div>
      </div>

      {profile.bio ? <p className="profile__bio">{profile.bio}</p> : null}

      {profile.location ? (
        <p className="profile__meta">
          <PinIcon />
          <span>{profile.location}</span>
        </p>
      ) : null}

      <a className="ghostbtn" href={profile.url} target="_blank" rel="noreferrer">
        <GithubMark />
        <span>View on GitHub</span>
      </a>
    </div>
  );
}
