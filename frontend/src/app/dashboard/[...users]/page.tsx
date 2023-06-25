'use client'
import React, {useContext, useEffect, useState} from 'react'
import styles from "./users.module.css"
import {useMutation, useQuery} from "react-query";
import Api from "@/app/api/api";
import {
	addBlock,
	addChat, addFriend, getBlockList, getChatList, getFriendList,
	getPublicUserInfo,
	getUserInfo,
	postProfilePicture, removeBlock, removeChat, removeFriend,
	UserAuthResponse
} from "@/app/auth/auth.api";
import Image from "next/image";
import {usePathname, useRouter} from "next/navigation";
import stylesGrid from "./grid.module.css"



interface UserProps {
}
interface MyPageProps {
	id: string;
}


const User: React.FC<UserProps> = ({}) => {

	const [self, setself] = useState<boolean>(true)
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	//GET PROFILE IMAGE
	const urlParam: string = usePathname().split('/').pop()!;
	const [profilePicture, setProfilePicture] = useState<string>('');
	const [ppGet, setPpGet] = useState<boolean>(false);
	if (!ppGet) {
		postProfilePicture(urlParam).then(
			res => {
				setProfilePicture('data:image/png;base64, ' + res?.data);
			}
		);
		setPpGet(true);
	}
	useEffect(() => {
		// console.log(profilePicture);
	}, [profilePicture])
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//GET PUBLIC USERS DATA FROM BACKEND AND DISPLAY IT
	let [userData, setuserData] = useState<any>();
	const { isLoading, error, data, refetch } = useQuery('getUserInfo', () => {
		const userID = {id: urlParam};
		getPublicUserInfo(urlParam).then(res => {
			setuserData(res?.data);
		}), {staleTime: 5000}
	});
	useEffect(() => {
		if (userData == undefined) {
			refetch()
		}
	})
	//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	//GET USERS DATA FROM BACKEND AND DISPLAY IT
	let [selfData, setselfData] = useState<UserAuthResponse>();
	const { push } = useRouter();
	useEffect(() => {
		getUserInfo().then(res => {
			if (res == undefined)
				push('/');
			setselfData(res);
		});
	}, [userData]);
	useEffect(() => {
		if (selfData?.id == urlParam) {
			setself(true);
		} else {
			setself(false);
		}
	},[selfData])
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
	useEffect(() => {
		if (userData?.id == urlParam) {
			setself(true);
		} else {
			setself(false);
		}
	},[userData])

	function onClickAddChat()  {
		const dtoId = {id: urlParam};
		addChat(dtoId).then( (res) => {
			console.log(res);
		})
	}
	function onClickRemoveChat() {
		const dtoId = {id: urlParam};
		removeChat(dtoId).then( (res) => {
			console.log(res);
		});
	}
	function onClickAddFriend() {
		const dtoId = {id: urlParam};
		addFriend(dtoId).then( (res) => {
			console.log(res);
		});
	}

	function onClickRemoveFriend() {
		const dtoId = {id: urlParam};
		removeFriend(dtoId).then( (res) => {
			console.log(res);
		});
	}

	function onClickAddBlock() {
		const dtoId = {id: urlParam};
		addBlock(dtoId).then( (res) => {
			console.log(res);
		});
	}
	function onClickRemoveBlock() {
		const dtoId = {id: urlParam};
		removeBlock(dtoId).then( (res) => {
			console.log(res);
		});
	}
	function onClickgetChatList() {
		getChatList().then( (res) => {
			console.log(res?.data)
			alert(JSON.stringify(res?.data));
		});
	}
	function onClickgetFriendList() {
		getFriendList().then( (res) => {
			console.log(res?.data)
			alert(JSON.stringify(res?.data));
		});
	}
	function onClickgetBlockList() {
		getBlockList().then( (res) => {
			console.log(res?.data)
			alert(JSON.stringify(res?.data));
		});
	}
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
  return (
	  <div className={stylesGrid.container}>
		  <div className={stylesGrid.section_a}>
			  <div className={styles.section_a_containerTop}>
				  <div className={styles.section_a_userHeader}>
					  {profilePicture && (<Image className={styles.section_a_userHeaderImg} src={!ppGet ? "/media/logo-login.png" : profilePicture} alt="profile-picture" width={128} height={128} priority={true}/>)}
					  <p className={styles.userHeader_displayname}>{userData?.displayname}</p>
				  </div>
				  <hr className={styles.hr}/>
				  {! self ?
					  <>
						  <div className={styles.containerChatWith}>
							  <div className={styles.chatWith} onClick={onClickAddChat}>Add chat</div>
							  <div className={styles.chatWith} onClick={onClickAddFriend}>Add friend</div>
							  <div className={styles.chatWith} onClick={onClickAddBlock}>Block user</div>

						  </div>
						  <div className={styles.containerChatWith}>
							  <div className={styles.removeChatWith} onClick={onClickRemoveChat}>Remove-chat</div>
							  <div className={styles.removeChatWith} onClick={onClickRemoveFriend}>Remove-friend</div>
							  <div className={styles.removeChatWith} onClick={onClickRemoveBlock}>Remove-block</div>
						  </div>
						  <div className={styles.containerChatWith}>
							  <div className={styles.chatWith} onClick={onClickgetChatList}>Get my chat list</div>
						  </div>
						  <div className={styles.containerChatWith}>
							  <div className={styles.chatWith} onClick={onClickgetFriendList}>Get my friend list</div>
						  </div>
						  <div className={styles.containerChatWith}>
							  <div className={styles.chatWith} onClick={onClickgetBlockList}>Get my block list</div>
						  </div>

				 	 </>
					  :
					  <div></div>
				  }
			  </div>
				  <div className={styles.section_a_containerBottom}>
				  <h1 className={styles.h1_section_a}>Rank:</h1>
				  <Image className={styles.img_section_a} src='/media/logo-login.png' alt='rank-image' width={128} height={128}/>
				  <p className={styles.p_section_a}>ADD SOME STATS HERE</p>
			  </div>
		  </div>
		  <div className={stylesGrid.section_b}>
			  <div className={styles.section_b_container}>
			  </div>
		  </div>
		  <div className={stylesGrid.section_c}>
			  <div className={styles.section_c_container}>
			  </div>
		  </div>
		  <div className={stylesGrid.section_d}>
			  <div className={styles.section_d_container}>
				  <h1 className={styles.section_d_h1}>Last games</h1>
				  <hr className={styles.hr} />
				  <div className={styles.section_d_games}>
					  <div className={styles.section_d_gamesitems}>Game 1</div>
					  <div className={styles.section_d_gamesitems}>Game 2</div>
					  <div className={styles.section_d_gamesitems}>Game 3</div>
					  <div className={styles.section_d_gamesitems}>Game 4</div>
				  </div>
			  </div>
		  </div>
	  </div>
  )
}

export default User;
