import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, onlineUsers, unreadCounts } = useChatStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const socket = useAuthStore((state) => state.socket);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (onlineUserIds) => {
      useChatStore.setState({ onlineUsers: onlineUserIds });
    };

    socket.on("getOnlineUsers", handleOnlineUsers);
    return () => socket.off("getOnlineUsers", handleOnlineUsers);
  }, [socket]);

  if (isUsersLoading) return <SidebarSkeleton />;

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="font-mono text-[11px] text-base-content/40">
            {onlineUsers.length - 1} online
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => {
          const isActive = selectedUser?._id === user._id;
          const unread = unreadCounts[user._id] || 0;
          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                isActive
                  ? "bg-base-300 border-l-2 border-primary"
                  : "border-l-2 border-transparent"
              }`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "https://api.dicebear.com/10.x/lorelei/svg"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-success rounded-full ring-2 ring-base-100" />
                )}
                {unread > 0 && (
                  <span className="absolute top-0 -right-1 size-2.5 rounded-full bg-primary ring-2 ring-base-100 lg:hidden" />
                )}
              </div>

              <div className="hidden lg:flex flex-1 items-center justify-between gap-2 min-w-0">
                <div className="text-left min-w-0">
                  <div className="font-medium truncate">{user.fullName}</div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-base-content/40">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
                {unread > 0 && (
                  <span className="badge badge-primary badge-sm font-mono">
                    {unread}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-base-content/40 py-4 text-sm">
            No online users
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;