'use client'  

import React, { useEffect, useState, useRef, useContext } from 'react';
import styles from './gameStart.module.css';
import { useRouter } from 'next/navigation';
import LoadingPage from '@/app/(component)/loadingPage/loadingPage';
import Image from 'next/image';
import {getUserInfo, postProfilePicture} from "@/app/auth/auth.api";
import {WebsocketContext} from "@/app/(common)/WebsocketContext";
import { getWebSocketIdByUserId } from "@/app/auth/auth.api";



interface UserLog {
  id: string;
  displayname: string;
  img: string;
}

interface gameStartProps {}

const GameStart: React.FC<gameStartProps> = ({}) => {
  const [userLogs, setUserLogs] = useState<UserLog[]>([]);
  const [userData, setUserData] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const { push, refresh } = useRouter();
  const [socket] = useState(useContext(WebsocketContext))


  useEffect(() => {
    getUserInfo().then((data) => {
      if (data) {
        setUserData(data);
      }
    });
  },[]);

  useEffect(() => {
    const fetchData = async () => {
      const local = localStorage.getItem('connectedUser');
      const currentUserId = userData?.id; 
      if (local) {
        let userLog = JSON.parse(local);
        if (currentUserId) {
          userLog = userLog.filter((user: UserLog) => user.id !== currentUserId);
        }
        for (let i = 0; userLog[i]; i++) {
          const img = await postProfilePicture(userLog[i].id);
          userLog[i].img = img?.data;
        }
        setUserLogs(userLog);
        setIsLoading(false);
      } else {
        setTimeout(() => {
          refresh();
        }, 5000);
      }
    };
    if(userData) {
      fetchData();
    }
  }, [userData]);

  const handleFightClick = (id: string) => {
    console.log(`Fight with user: ${id}`);

    getWebSocketIdByUserId(id).then((res) => {
    console.log(`This is res.data = ${res?.data}`);
    socket.emit('duelRequest', {socketId: res?.data});
    })
};



  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Liste des utilisateurs connectés</h2>
      <div className={styles.users}>
        {isLoading ? (
          <LoadingPage />
        ) : (
          <div className={styles.userContainer}>
            {userLogs.map((user) => (
              <div key={user.id} className={styles.userlogcontainer}>
                <div onClick={() => push(`/dashboard/user/${user.id}`)} className={styles.row}>
                  <Image
                    className={styles.img}
                    src={`data:image/png;base64,${user.img}`}
                    alt={user.displayname}
                    width={50}
                    height={50}
                  />
                  <p className={`${styles.userlogp} ${styles.whiteText}`}>{user.displayname}</p>
                </div>
                  <button onClick={() => handleFightClick(user.id)} className={styles.fightButton}>Fight</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


export default GameStart;
