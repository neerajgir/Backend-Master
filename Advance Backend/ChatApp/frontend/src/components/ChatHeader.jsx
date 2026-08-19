import { useChatStore } from "../store/useChatStore";
import { X } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, onlineUsers, setSelectedUser } = useChatStore();

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="p-3 border-b border-base-300 bg-base-200/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-11 rounded-full relative">
              <img
                src={selectedUser.profilePic || "https://api.dicebear.com/10.x/lorelei/svg"}
                alt={selectedUser.fullName}
              />
              {isOnline && (
                <span className="absolute bottom-0 right-0 size-3 bg-success rounded-full ring-2 ring-base-100">
                  <span className="sonar-dot absolute inset-0 rounded-full" />
                </span>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium leading-tight">{selectedUser.fullName}</h3>
            <p
              className={`font-mono text-[11px] uppercase tracking-widest ${
                isOnline ? "text-success" : "text-base-content/40"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSelectedUser(null)}
          className="btn btn-sm btn-ghost"
          aria-label="Close conversation"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;