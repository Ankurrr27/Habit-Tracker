import UsersHeader from "./UsersHeader";
import UsersSkeleton from "./UsersSkeleton";
import UsersGrid from "./UsersGrid";
import { useUsers } from "./useUsers";

export default function Users() {
  const {
    users,
    requests,
    search,
    setSearch,
    loading,
    error,
    sendFriendRequest,
    acceptRequest,
    rejectRequest,
  } = useUsers();

  return (
    <div className="mx-auto max-w-7xl space-y-6 bg-white px-4 py-6 sm:px-6 dark:bg-black">
      <UsersHeader search={search} onSearch={setSearch} />

      {requests.length > 0 && !loading && (
        <section className="rounded-[2rem] bg-zinc-50 p-5 shadow-sm dark:bg-zinc-950">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Friend requests
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            People waiting for your response.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {requests.map((request) => (
              <div
                key={request._id}
                className="rounded-2xl bg-white px-4 py-4 shadow-sm dark:bg-zinc-900"
              >
                <div className="flex items-center gap-3">
                  {request.sender?.avatar ? (
                    <img
                      src={request.sender.avatar}
                      alt={request.sender?.name || "friend request"}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                      {(request.sender?.name || request.sender?.username || "?")[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {request.sender?.name}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      @{request.sender?.username}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() =>
                      acceptRequest(request._id, request.sender?._id)
                    }
                    className="flex-1 rounded-full bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      rejectRequest(request._id, request.sender?._id)
                    }
                    className="flex-1 rounded-full bg-white px-3 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {loading && <UsersSkeleton />}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-100 p-4 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="rounded-2xl bg-zinc-50 p-5 text-zinc-700 shadow-sm dark:bg-zinc-950 dark:text-zinc-400">
          No matching users found
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <UsersGrid users={users} onAddFriend={sendFriendRequest} />
      )}
    </div>
  );
}
