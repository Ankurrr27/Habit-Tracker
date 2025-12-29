import UserCard from "../UserCard";

export default function UsersGrid({ users }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <UserCard
          key={user._id || user.username}
          user={user}
        />
      ))}
    </div>
  );
}
