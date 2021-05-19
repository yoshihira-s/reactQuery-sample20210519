import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import { ReactQueryDevtools } from 'react-query/devtools';
import './App.css';

function App() {
  const queryClient = new QueryClient();

  const fetchUsers = async (start) => {
    const res = await fetch(
      //クエリ文字列にスタートのIDと上限数を記述できる
      `https://jsonplaceholder.typicode.com/users?_start=${start}&_limit=5`
    );
    return res.json();
  };

  const Users = () => {
    const [start, setStart] = useState(0);
    // const { data, status } = useQuery('users', fetchUsers);
    const { data, status } = useQuery(
      ['users', start],
      () => fetchUsers(start),
      {
        keepPreviousData: true,
      }
    );

    console.log(data);

    return (
      <div>
        <h2>名前</h2>
        {/* <p>{status}</p> */}
        {status === 'loading' && <div>ロード中</div>}
        {status === 'error' && <div>取得できませんでした</div>}
        {status === 'success' && (
          <>
            <button
              onClick={() => setStart((old) => Math.max(old - 5, 0))}
              disabled={start === 0}
            >
              前の5件へ
            </button>

            <button onClick={() => setStart(start + 5)} disabled={start > 4}>
              次の5件へ
            </button>

            <div>
              {data.map((user) => (
                <>
                  <h3 key={user.id}>{user.username}</h3>
                  <p key={user.email}>{user.email}</p>
                  <br />
                </>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Users />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
