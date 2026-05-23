import type { User } from './UseContextpage';
import { Profile, Sidebar } from './Components.tsx';

interface DashboardProps {
    user: User
}

export default function Dashboard({user} : DashboardProps){

    return (
        <div>
            <Sidebar user={user}/>
            <Profile user={user}/>
        </div>
    )

}