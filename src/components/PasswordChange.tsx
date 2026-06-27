import React, { useState, useEffect } from "react";
import { KeyRound, ShieldAlert, CheckCircle, XCircle, RefreshCw, User, Mail, Phone, Image as ImageIcon, Settings, AtSign } from "lucide-react";
import { api } from "../utils/api";
import { User as UserType } from "../types";

interface PasswordChangeProps {
  onSuccessLogout: () => void;
  onNotify: (message: string, type: "success" | "error") => void;
  currentUser: UserType | null;
  onProfileUpdate: (updatedUser: UserType) => void;
}

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&q=80"
];

export const PasswordChange: React.FC<PasswordChangeProps> = ({ 
  onSuccessLogout, 
  onNotify,
  currentUser,
  onProfileUpdate
}) => {
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // Profile fields state
  const [firstName, setFirstName] = useState(currentUser?.firstName || "");
  const [lastName, setLastName] = useState(currentUser?.lastName || "");
  const [username, setUsername] = useState(currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [avatar, setAvatar] = useState(currentUser?.avatar || "");
  const [profileLoading, setProfileLoading] = useState(false);

  // Sync profile fields if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName);
      setUsername(currentUser.username);
      setEmail(currentUser.email);
      setPhone(currentUser.phone);
      setAvatar(currentUser.avatar);
    }
  }, [currentUser]);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Real-time checks
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword !== "";

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      onNotify("First Name, Last Name, and Username are required.", "error");
      return;
    }

    setProfileLoading(true);
    try {
      const res = await (api as any).updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
        avatar: avatar.trim()
      });
      onNotify(res.message || "Profile updated successfully.", "success");
      onProfileUpdate(res.user);
    } catch (err: any) {
      onNotify(err.message || "Failed to update profile.", "error");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
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

    setPasswordLoading(true);
    try {
      const res = await api.changePassword(currentPassword, newPassword);
      onNotify(res.message || "Password successfully changed. Logging out...", "success");
      
      // Auto logout and trigger login flow again
      setTimeout(() => {
        onSuccessLogout();
      }, 1500);
    } catch (err: any) {
      onNotify(err.message || "Failed to update password.", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-6 animate-fade-in text-gray-800 dark:text-gray-100">
      <div className="border-b border-gray-100 dark:border-stone-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-red-600" /> Admin Profile & Security
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-sans mt-1">
            Manage your personal profile information and change credentials secure keys.
          </p>
        </div>
        
        {/* Tab switcher */}
        <div className="flex bg-gray-100 dark:bg-stone-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "profile"
                ? "bg-white dark:bg-stone-700 text-gray-900 dark:text-white shadow-xs"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <User className="w-3.5 h-3.5" /> Profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "password"
                ? "bg-white dark:bg-stone-700 text-gray-900 dark:text-white shadow-xs"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" /> Password
          </button>
        </div>
      </div>

      {/* PROFILE DETAILS TAB */}
      {activeTab === "profile" && (
        <form onSubmit={handleProfileSubmit} className="space-y-6 font-sans text-sm">
          {/* Avatar select */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-400 font-mono uppercase tracking-widest">
              Profile Avatar
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <img
                src={avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${firstName || "Wow"}`}
                alt="Selected avatar"
                className="w-16 h-16 rounded-full border-2 border-red-500 object-cover bg-gray-100 dark:bg-stone-800 shrink-0"
              />
              <div className="space-y-1.5">
                <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">Select a photo preset or enter a custom image URL:</span>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(p)}
                      className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        avatar === p ? "border-red-500 scale-110" : "border-transparent hover:scale-105"
                      }`}
                    >
                      <img src={p} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAvatar(`https://api.dicebear.com/7.x/initials/svg?seed=${firstName || "Wow"}`)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold border font-mono transition-all cursor-pointer ${
                      avatar.startsWith("https://api.dicebear.com")
                        ? "border-red-500 text-red-600 bg-red-50 dark:bg-red-950/25 dark:text-red-400"
                        : "border-gray-200 dark:border-stone-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    Initials
                  </button>
                </div>
              </div>
            </div>

            <div className="relative mt-2">
              <ImageIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                placeholder="Custom Avatar Image URL"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 focus:bg-white dark:bg-stone-800 dark:focus:bg-stone-850 rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 font-mono uppercase mb-1.5">First Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 focus:bg-white dark:bg-stone-800 dark:focus:bg-stone-850 rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 font-mono uppercase mb-1.5">Last Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 focus:bg-white dark:bg-stone-800 dark:focus:bg-stone-850 rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 font-mono uppercase mb-1.5">Username</label>
              <div className="relative">
                <AtSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 focus:bg-white dark:bg-stone-800 dark:focus:bg-stone-850 rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 font-mono uppercase mb-1.5">Role / Position</label>
              <input
                type="text"
                disabled
                value={currentUser?.role || "Manager"}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-stone-800 text-gray-400 dark:text-stone-500 font-bold rounded-xl border border-transparent cursor-not-allowed uppercase font-mono tracking-wider"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 font-mono uppercase mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 focus:bg-white dark:bg-stone-800 dark:focus:bg-stone-850 rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 font-mono uppercase mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="+251..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 focus:bg-white dark:bg-stone-800 dark:focus:bg-stone-850 rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={profileLoading || !firstName.trim() || !lastName.trim() || !username.trim()}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-xs"
          >
            {profileLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
            Save Profile Updates
          </button>
        </form>
      )}

      {/* SECURITY: PASSWORD CHANGE TAB */}
      {activeTab === "password" && (
        <form onSubmit={handlePasswordSubmit} className="space-y-4 font-sans text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 font-mono uppercase mb-1.5">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 bg-gray-50 focus:bg-white dark:bg-stone-800 dark:focus:bg-stone-850 rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 font-mono uppercase mb-1.5">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 bg-gray-50 focus:bg-white dark:bg-stone-800 dark:focus:bg-stone-850 rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 font-mono uppercase mb-1.5">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-gray-50 focus:bg-white dark:bg-stone-800 dark:focus:bg-stone-850 rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800 dark:text-white"
            />
          </div>

          {/* Real-time feedback rules */}
          <div className="bg-gray-50 dark:bg-stone-850 p-4 rounded-2xl border border-gray-100 dark:border-stone-800 space-y-2.5">
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 font-sans flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-500" /> Password Strength Requirements:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                {hasMinLength ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300 dark:text-stone-700" />}
                <span className={hasMinLength ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-gray-500 dark:text-gray-400"}>At least 8 characters</span>
              </div>
              <div className="flex items-center gap-1.5">
                {hasUppercase ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300 dark:text-stone-700" />}
                <span className={hasUppercase ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-gray-500 dark:text-gray-400"}>Uppercase letter (A-Z)</span>
              </div>
              <div className="flex items-center gap-1.5">
                {hasLowercase ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300 dark:text-stone-700" />}
                <span className={hasLowercase ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-gray-500 dark:text-gray-400"}>Lowercase letter (a-z)</span>
              </div>
              <div className="flex items-center gap-1.5">
                {hasNumber ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300 dark:text-stone-700" />}
                <span className={hasNumber ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-gray-500 dark:text-gray-400"}>Includes a number (0-9)</span>
              </div>
              <div className="flex items-center gap-1.5">
                {hasSpecial ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300 dark:text-stone-700" />}
                <span className={hasSpecial ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-gray-500 dark:text-gray-400"}>Special symbol (!@#$%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                {passwordsMatch ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300 dark:text-stone-700" />}
                <span className={passwordsMatch ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-gray-500 dark:text-gray-400"}>Passwords match perfectly</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={passwordLoading || !hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial || !passwordsMatch}
            className="w-full py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-xs"
          >
            {passwordLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
            Update Security Password
          </button>
        </form>
      )}
    </div>
  );
};
export default PasswordChange;
