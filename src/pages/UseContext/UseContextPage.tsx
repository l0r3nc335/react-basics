import { useState } from 'react';

import Dashboard from './Dashboard';

export interface User {
    isSubscribed: boolean;
    name: string;
}

interface DemoProps {}

export default function UseContext({} : DemoProps){
    const [user] = useState<User>({
        isSubscribed: true,
        name: 'Enzo'
    });
    
    return (
        <div>
            <Dashboard user={user} />
        </div>
    )
}