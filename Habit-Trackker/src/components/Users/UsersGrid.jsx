import UserCard from "../UserCard";

export default function UsersGrid({ users, onAddFriend }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {users.map((user) => (
        <UserCard
          key={user._id || user.username}
          user={user}
          onAddFriend={onAddFriend}
        />
      ))}
    </div>
  );
}
