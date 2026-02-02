import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", username: "", displayName: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-mantra-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-display font-bold text-lg">M</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink-950">Create your account</h1>
          <p className="text-ink-500 text-sm mt-1">Join Mantra and discover news your way</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={update("email")}
              className="input-field" placeholder="you@example.com" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">Username</label>
              <input type="text" value={form.username} onChange={update("username")}
                className="input-field" placeholder="johndoe" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">Display Name</label>
              <input type="text" value={form.displayName} onChange={update("displayName")}
                className="input-field" placeholder="John Doe" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={update("password")}
                className="input-field pr-10"
                placeholder="Min 8 characters"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
            {loading ? "Creating account..." : <><UserPlus className="w-4 h-4" /> Sign up</>}
          </button>
        </form>

        <p className="text-center text-sm text-ink-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-mantra-600 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
