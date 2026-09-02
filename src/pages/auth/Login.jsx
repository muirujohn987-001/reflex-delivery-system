import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, ShieldCheck } from "lucide-react";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Logo from "../../components/ui/Logo";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/ui/Toast";
import { ROLE_HOME, ROLES } from "../../utils/constants";

const ROLE_OPTIONS = [
  { value: ROLES.RETAILER, label: "Retailer" },
  { value: ROLES.DISPATCHER, label: "Dispatcher" },
  { value: ROLES.RIDER, label: "Rider" },
];

export default function Login({ startFlipped = false }) {
  const [flipped, setFlipped] = useState(startFlipped);
  const [loginData, setLoginData] = useState({ identifier: "", password: "" });
  const [registerData, setRegisterData] = useState({ fullName: "", email: "", phone: "", password: "", role: "" });
  const [errors, setErrors] = useState({});
  const { login, register, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validateLogin = () => {
    const e = {};
    if (!loginData.identifier.trim()) e.identifier = "Enter your email or phone number";
    if (!loginData.password) e.password = "Enter your password";
    else if (loginData.password.length < 4) e.password = "Password is too short";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateRegister = () => {
    const e = {};
    if (!registerData.fullName.trim()) e.fullName = "Enter your full name";
    if (!registerData.email.trim()) e.email = "Enter your email";
    else if (!/^\S+@\S+\.\S+$/.test(registerData.email)) e.email = "Enter a valid email";
    if (!registerData.phone.trim()) e.phone = "Enter your phone number";
    if (!registerData.password || registerData.password.length < 6) e.password = "Use at least 6 characters";
    if (!registerData.role) e.role = "Choose an account type";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (evt) => {
    evt.preventDefault();
    if (!validateLogin()) return;
    // Demo: infer role from identifier keyword, default retailer.
    const guess = /dispatch/i.test(loginData.identifier)
      ? ROLES.DISPATCHER
      : /rider|david/i.test(loginData.identifier)
        ? ROLES.RIDER
        : ROLES.RETAILER;
    const user = await login({ role: guess });
    showToast(`Welcome back, ${user.name}`);
    navigate(ROLE_HOME[user.role]);
  };

  const handleRegister = async (evt) => {
    evt.preventDefault();
    if (!validateRegister()) return;
    const user = await register(registerData);
    showToast("Account created successfully");
    navigate(ROLE_HOME[user.role]);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-8 sm:px-6">
      <div className="flip-scene w-full max-w-4xl">
        <div className={`flip-card relative min-h-[680px] sm:min-h-[620px] ${flipped ? "flipped" : ""}`}>
          {/* FRONT: split login */}
          <div
            className={`flip-face relative grid overflow-hidden rounded-2xl bg-white shadow-card-hover md:grid-cols-2
              ${flipped ? "pointer-events-none" : "pointer-events-auto"}`}
          >
            <BrandPanel />
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 md:py-14">
              <h1 className="text-2xl font-extrabold text-ink">Welcome back</h1>
              <p className="mt-1.5 text-sm text-gray-500">Sign in to continue to your account</p>

              <form className="mt-7 space-y-4" onSubmit={handleLogin} noValidate>
                <Input
                  label="Email or Phone"
                  icon={Mail}
                  placeholder="Enter email or phone"
                  value={loginData.identifier}
                  error={errors.identifier}
                  onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                  autoComplete="username"
                />
                <Input
                  label="Password"
                  icon={Lock}
                  type="password"
                  placeholder="Enter password"
                  value={loginData.password}
                  error={errors.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  autoComplete="current-password"
                />

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-teal-500 focus:ring-teal-400" />
                    Remember me
                  </label>
                  <button type="button" className="text-sm font-semibold text-teal-600 hover:text-teal-700">
                    Forgot password?
                  </button>
                </div>

                <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
                  Sign In
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <button onClick={() => setFlipped(true)} className="font-semibold text-maroon-500 hover:text-maroon-600">
                  Create Account
                </button>
              </p>

              <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Secure login with your credentials
              </p>
            </div>
          </div>

          {/* BACK: registration */}
          <div
            className={`flip-face flip-face-back absolute inset-0 grid overflow-hidden rounded-2xl bg-white shadow-card-hover md:grid-cols-2
              ${flipped ? "pointer-events-auto" : "pointer-events-none"}`}
          >
            <BrandPanel compact />
            <div className="flex flex-col justify-center overflow-y-auto px-6 py-8 sm:px-10">
              <h1 className="text-2xl font-extrabold text-ink">Create Account</h1>
              <p className="mt-1.5 text-sm text-gray-500">Join REFLEX to start coordinating deliveries</p>

              <form className="mt-6 space-y-3.5" onSubmit={handleRegister} noValidate>
                <Input
                  label="Full Name"
                  icon={User}
                  placeholder="Enter your full name"
                  value={registerData.fullName}
                  error={errors.fullName}
                  onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                />
                <Input
                  label="Email"
                  icon={Mail}
                  type="email"
                  placeholder="Enter your email"
                  value={registerData.email}
                  error={errors.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                />
                <Input
                  label="Phone"
                  icon={Phone}
                  placeholder="Enter your phone number"
                  value={registerData.phone}
                  error={errors.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                />
                <Input
                  label="Password"
                  icon={Lock}
                  type="password"
                  placeholder="Create a password"
                  value={registerData.password}
                  error={errors.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                />
                <Select
                  label="Account Type"
                  placeholder="Select account type"
                  options={ROLE_OPTIONS}
                  error={errors.role}
                  value={registerData.role}
                  onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                />

                <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
                  Create Account
                </Button>
              </form>

              <p className="mt-5 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <button onClick={() => setFlipped(false)} className="font-semibold text-maroon-500 hover:text-maroon-600">
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandPanel({ compact = false }) {
  return (
    <div className="relative hidden flex-col overflow-hidden bg-maroon-500 px-10 py-12 text-white md:flex">
      <div className="relative z-10">
        <Logo size={64} showTagline taglineClassName="text-white/80" />
      </div>

      {!compact && (
        <div className="relative z-10 mt-8">
          <p className="text-2xl font-bold leading-snug">Smart Delivery Coordination</p>
          <p className="mt-3 max-w-xs text-sm text-white/80">
            Connect retailers, dispatchers and riders on one platform built for speed and reliability.
          </p>
        </div>
      )}

      {/* Truck fills all remaining space, including the area where the building silhouettes used to sit */}
      {!compact && (
        <div className="absolute inset-x-0 bottom-0 top-[36%] z-0 flex items-end justify-center px-6 pb-16">
          <img src="/truck.png" alt="Delivery truck" className="max-h-full w-full max-w-md object-contain object-bottom" />
        </div>
      )}

      <div className="absolute bottom-3 left-30 right-0 z-10 mt-6">
        <p className="text-xs text-white/50">REFLEX &copy; {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}