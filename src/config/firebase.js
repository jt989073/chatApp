// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCuP8xp6OawPR-UUK1UkPYhVyBczhrz50I",
  authDomain: "chatapp-442b3.firebaseapp.com",
  projectId: "chatapp-442b3",
  storageBucket: "chatapp-442b3.appspot.com",
  messagingSenderId: "768622212879",
  appId: "1:768622212879:web:475044f2bb7161da33f07a"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

 const signup = async (username, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        const user = res.user
        await setDoc(doc(db, 'Users', user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name: '',
            avatar: '',
            bio: 'Hey, ther I am using this super cool chat app',
            lastSeen: Date.now()
        })
        await setDoc(doc(db, 'Chats', user.uid),{
            chatData: [],

        })
    } catch (e) {
        console.error(e)
        toast.error(e.code.split('/')[1].split('-').join(' '))
    }
}

const login = async ( email, password) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password)
        const user = res.user
        console.log(user)
    } catch(e) {
        console.log(e)
        toast.error(e.code.split('/')[1].split('-').join(' '))
    }
}


const logout = async () => {
    try {
        await signOut(auth)
    } catch (e) {
        console.log(e)

        toast.error(e.code.split('/')[1].split('-').join(' '))
    }
}


export {signup,login, logout, auth, db}