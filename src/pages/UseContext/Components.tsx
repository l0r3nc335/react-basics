import type { User } from './UseContextpage';

interface SidebarProps {
    user: User;
}

export function Sidebar({ user }: SidebarProps) {
    return (
        <div>
            <div>{user.name}</div>
            <div>Subscription status: {user.isSubscribed}</div>
        </div>
    )
}

interface ProfileProps {
    user: User;
}

export function Profile({ user } : ProfileProps) {
    return (
        <div>{user.name}</div>
    )
}