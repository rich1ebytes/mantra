import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Lock, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { supabase } from "../services/supabaseClient";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  // Supabase sends tokens in the URL hash — listen for the auth event
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-40 -right-32 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-32 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.7 }}
            className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-orange-500/25"
          >
            <Lock className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
            Set new password
          </h1>
          <p className="text-slate-500 mt-2">
            Choose a strong password for your account
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated p-8 text-center"
          >
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Password updated!</h2>
            <p className="text-slate-500 text-sm mb-6">
              Your password has been reset successfully. Redirecting to login...
            </p>
            <Link to="/login" className="btn-primary w-full py-3">
              Go to login
            </Link>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card-elevated p-8 space-y-5"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700 flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                {error}
              </motion.div>
            )}

            {!sessionReady && (
              <div className="px-4 py-3 bg-yellow-50 border border-yellow-100 rounded-xl text-sm text-yellow-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Verifying reset link... If this persists, request a new reset email.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">New password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                  })}
                  className="input-field pr-11"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Confirm password</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) => val === watch("password") || "Passwords don't match",
                })}
                className="input-field"
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword.message}</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading || !sessionReady}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-60"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </span>
              ) : (
                "Update password"
              )}
            </motion.button>
          </motion.form>
        )}

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link to="/login" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
            Back to login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
