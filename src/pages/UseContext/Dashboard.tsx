import { Profile, Sidebar } from './Components.tsx';

interface DashboardProps {
}

export default function Dashboard({} : DashboardProps){

    return (
        <div>
            <Sidebar />
            <Profile />
        </div>
    )

}