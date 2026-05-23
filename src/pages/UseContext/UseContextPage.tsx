
import { useState } from 'react';

import { DashboardContext } from './context';
import Dashboard from './Dashboard';


export interface User {
    isSubscribed: boolean;
    name: string;
}

interface DemoProps {}

export default function UseContextPage({} : DemoProps){
    const [user] = useState<User>({
        isSubscribed: true,
        name: 'Enzo'
    });
    
    return (
        <DashboardContext.Provider value={user}>
            <Dashboard />
        </DashboardContext.Provider>
    )
}