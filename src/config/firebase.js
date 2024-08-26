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
        
        const userData = {
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name: '',
            avatar: '',
            bio: 'Hey, there I am using this super cool chat app',
            lastSeen: Date.now()
        };
        
        await setDoc(doc(db, 'Users', user.uid), userData);
        
        const chatData = {
            chatsData: [],
        };
        
        await setDoc(doc(db, 'Chats', user.uid), chatData);
        
        // Store userData and chatData in session storage
        sessionStorage.setItem('userData', JSON.stringify(userData));
        sessionStorage.setItem('chatData', JSON.stringify(chatData));

        // Optionally, navigate to the chat page or user dashboard
        navigate("/chat");
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

        console.log(sessionStorage.getItem('userData'))
        
        console.log('User signed in:', user);
        
    } catch (e) {
        console.log(e);
        toast.error(e.code.split('/')[1].split('-').join(' '));
    }
}


const logout = async () => {
    try {
        await signOut(auth);
        
        // Clear session storage items
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('chatData');
        
        // Optionally, navigate to the login page or home page
        navigate("/login");
    } catch (e) {
        console.log(e);
        toast.error(e.code.split('/')[1].split('-').join(' '));
    }
}


export {signup,login, logout, auth, db}