import Login from "./Login";

// The /register route shares the same flip-card experience as /login;
// Login already exposes both faces, so this simply mounts it.
export default function Register() {
  return <Login startFlipped />;
}
