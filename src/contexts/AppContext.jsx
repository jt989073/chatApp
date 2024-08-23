import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db, auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export const AppContext = createContext()

const AppContextProvider = (props) => {
    const navigate = useNavigate()
const [userData, setUserData] = useState(null)
const [chatData, setChatData] = useState(null)

const loadUserData = async uid => {
    try {
        const userRef = doc(db, 'Users', uid)
        const userSnap = await getDoc(userRef)
        const userData = userSnap.data()


        if(userData.avatar && userData.name){
            navigate('/chat')
        } else {
            navigate('/profile')
        }

        await updateDoc(userRef, {
            lastSeen: Date.now()
        })

        setInterval(async () => {
            if(auth.chatUser){
                await updateDoc(userRef, {
                    lastSeen: Date.now()
                })
            }
        }, 60000)
    } catch (e) {
        toast.error(e.message)
        console.error(e)
    }
}

    useEffect(() => {
        if(userData){
            const chatRef = doc(db, 'Chats', userData.id)
            const unsub = onSnapshot(chatRef, async res => {
                const chatItems = res.data().chatsData
                const tempData = []
                for(const item of chatItems){
                    const userRef = doc(db, 'Users', item.rId)
                    const userSnap = await getDoc(userRef)
                    const userData = userSnap.data()
                    tempData.push({...item, userData})
                }
                setChatData(tempData.sort((a,b) => b.updatedAt - a.updatedAt))
            })
            return () => {unsub()}
        }
    }, [userData])

    const value = {
        userData,
        setUserData,
        chatData,
        setChatData,
        loadUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider