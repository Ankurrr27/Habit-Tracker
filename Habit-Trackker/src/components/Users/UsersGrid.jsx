import UserCard from "../UserCard";

export default function UsersGrid({ users, onToggleFollow }) {
  return (
    <div className="flex flex-col gap-4 pb-20">
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
