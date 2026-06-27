import React, { useState } from "react";
import { KeyRound, ShieldAlert, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { api } from "../utils/api";

interface PasswordChangeProps {
  onSuccessLogout: () => void;
  onNotify: (message: string, type: "success" | "error") => void;
}

export const PasswordChange: React.FC<PasswordChangeProps> = ({ onSuccessLogout, onNotify }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Real-time checks
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      onNotify("Please fill in all password fields.", "error");
      return;
    }

    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      onNotify("New password does not meet the security requirements.", "error");
      return;
    }

    if (!passwordsMatch) {
      onNotify("Passwords do not match.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await api.changePassword(currentPassword, newPassword);
      onNotify(res.message || "Password successfully changed.", "success");
      
      // Auto logout and trigger login flow again
      setTimeout(() => {
        onSuccessLogout();
      }, 1500);
    } catch (err: any) {
      onNotify(err.message || "Failed to update password.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6 animate-fade-in">
      <div className="border-b border-gray-50 pb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-red-600" /> Security: Change Password
        </h2>
        <p className="text-xs text-gray-500 font-sans mt-1">Configure a unique, highly secure password to guard administrative access.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
        <div>
          <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">Current Password</label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-3 bg-gray-50 focus:bg-white rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">New Password</label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 bg-gray-50 focus:bg-white rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">Confirm New Password</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 bg-gray-50 focus:bg-white rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800"
          />
        </div>

        {/* Real-time feedback rules */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2.5">
          <p className="text-xs font-bold text-gray-700 font-sans flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-red-500" /> Password Strength Requirements:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              {hasMinLength ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}
              <span className={hasMinLength ? "text-emerald-700 font-semibold" : "text-gray-500"}>At least 8 characters</span>
            </div>
            <div className="flex items-center gap-1.5">
              {hasUppercase ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}
              <span className={hasUppercase ? "text-emerald-700 font-semibold" : "text-gray-500"}>Uppercase letter (A-Z)</span>
            </div>
            <div className="flex items-center gap-1.5">
              {hasLowercase ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}
              <span className={hasLowercase ? "text-emerald-700 font-semibold" : "text-gray-500"}>Lowercase letter (a-z)</span>
            </div>
            <div className="flex items-center gap-1.5">
              {hasNumber ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}
              <span className={hasNumber ? "text-emerald-700 font-semibold" : "text-gray-500"}>Includes a number (0-9)</span>
            </div>
            <div className="flex items-center gap-1.5">
              {hasSpecial ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}
              <span className={hasSpecial ? "text-emerald-700 font-semibold" : "text-gray-500"}>Special symbol (!@#$%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              {passwordsMatch ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}
              <span className={passwordsMatch ? "text-emerald-700 font-semibold" : "text-gray-500"}>Passwords match perfectly</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial || !passwordsMatch}
          className="w-full py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
          Update Security Password
        </button>
      </form>
    </div>
  );
};
export default PasswordChange;
