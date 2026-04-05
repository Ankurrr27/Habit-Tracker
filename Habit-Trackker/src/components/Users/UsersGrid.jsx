import UserCard from "../UserCard";

export default function UsersGrid({ users, onToggleFollow }) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 pb-12">
      {users.map((user) => (
        <UserCard
          key={user._id || user.username}
          user={user}
          onToggleFollow={onToggleFollow}
        />
      ))}
    </div>
  );
}
