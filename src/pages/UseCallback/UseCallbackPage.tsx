import { useCallback, useState } from 'react';

import { shuffle } from '../../utils/shuffle';

import Search from './Search';

const allUsers = [
  'john',
  'alex',
  'george',
  'simon',
  'james',
];

interface DemoProps {}

export default function UseCallback({}: DemoProps) {
  const [users, setUsers] = useState(allUsers);

  /*
  const handleSearch = (text: string) => {
    const filterUsers = allUsers.filter(
      (user) => user.includes(text)
    );
    setUsers(filterUsers);
  };
  */

  const handleSearch = useCallback((text: string) => {
    console.log(users[0]);

    const filterUsers = allUsers.filter(
      (user) => user.includes(text)
    );
    setUsers(filterUsers);
  }, [users]);
  
  return (
    <div className='sample'>
      <div className='align-center mb-2 flex'>
        <button onClick={() => setUsers(shuffle(allUsers))}>
          Shuffle
        </button>

        <Search onChange={handleSearch} />
      </div>
      <ul>
        {users.map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>
    </div>
  );
}