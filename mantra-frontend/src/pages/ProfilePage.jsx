import { useAuth } from "../context/AuthContext";
import { User, Mail, Calendar, FileText } from "lucide-react";
import { formatDate, getInitials } from "../utils/helpers";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="card p-8 text-center">
        {/* Avatar */}
        <div className="w-20 h-20 bg-mantra-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-mantra-700">
              {getInitials(user.displayName || user.username)}
            </span>
          )}
        </div>

        <h1 className="font-display text-2xl font-bold text-ink-950">
          {user.displayName || user.username}
        </h1>
        <p className="text-ink-500 text-sm">@{user.username}</p>

        {user.bio && (
          <p className="text-ink-600 text-sm mt-3 max-w-md mx-auto">{user.bio}</p>
        )}

        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-ink-500">
          <span className="flex items-center gap-1.5">
            <Mail className="w-4 h-4" /> {user.email}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> Joined {formatDate(user.createdAt)}
          </span>
        </div>

        <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1.5 bg-mantra-50 text-mantra-700 
                        text-xs font-semibold rounded-full border border-mantra-200">
          <User className="w-3.5 h-3.5" /> {user.role}
        </div>
      </div>
    </div>
  );
}
