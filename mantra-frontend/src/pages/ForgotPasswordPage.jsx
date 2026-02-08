import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Mail, ArrowLeft, Check } from "lucide-react";
import { authAPI } from "../services/authService";

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      await authAPI.forgotPassword(data.email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send reset email. Please try again.");
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
            <Mail className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
            Reset your password
          </h1>
          <p className="text-slate-500 mt-2">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated p-8 text-center"
          >
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Check your email</h2>
            <p className="text-slate-500 text-sm mb-6">
              We've sent a password reset link to your email address. Click the link to set a new password.
            </p>
            <Link to="/login" className="btn-primary w-full py-3">
              Back to login
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="input-field"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-60"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                "Send reset link"
              )}
            </motion.button>
          </motion.form>
        )}

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link to="/login" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
