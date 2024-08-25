// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { browserSessionPersistence, createUserWithEmailAndPassword, getAuth, setPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCuP8xp6OawPR-UUK1UkPYhVyBczhrz50I",
  authDomain: "chatapp-442b3.firebaseapp.com",
  projectId: "chatapp-442b3",
  storageBucket: "chatapp-442b3.appspot.com",
  messagingSenderId: "768622212879",
  appId: "1:768622212879:web:475044f2bb7161da33f07a"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

const signup = async (username, email, password) => {
    try {
        await setPersistence(auth, browserSessionPersistence);
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, 'Users', user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name: '',
            avatar: '',
            bio: 'Hey, there I am using this super cool chat app',
            lastSeen: Date.now()
        });

       
        await setDoc(doc(db, 'Chats', user.uid), {
            chatsData: [],
        });



    } catch (e) {
        console.error(e);
        toast.error(e.code.split('/')[1].split('-').join(' '));
    }
}

const login = async (email, password) => {
    try {
        await setPersistence(auth, browserSessionPersistence);

        const res = await signInWithEmailAndPassword(auth, email, password);
        const user = res.user;
        
        const userRef = doc(db, 'Users', user.uid)
        const userDoc = await getDoc(userRef)
        const userSnap = userDoc.data()
        console.log(userSnap)
        sessionStorage.setItem('userData', userSnap)
        console.log(sessionStorage.getItem('userData'))
        
        console.log('User signed in:', user);
        
    } catch (e) {
        console.log(e);
        toast.error(e.code.split('/')[1].split('-').join(' '));
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