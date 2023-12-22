import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { auth,database } from '../firebaseConfig'

const Login = () => {
  const nav = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { updateUser } = useUser();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
  
      const userDocRef = doc(database, 'users', userId);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
  
        // Update the user context
        updateUser(userData);
  
        // Store user data in session storage
        await sessionStorage.setItem('user', JSON.stringify(userData));
  
        // Navigate based on isAdmin
        const destination = userData.isAdmin ? '/admin' : '/';
        nav(destination);
      }
    } catch (error) {
      console.error('Login failed', error.message);
    }
  };

  return (
    <div className='h-screen flex flex-col'>
      <Navbar />
      <div className='flex-grow w-full flex'>
        <div className='w-full sm:w-1/2 h-full flex items-center justify-center'>
          <div className='sm:w-full items-center flex flex-col gap-4 mb-20 sm:border-r border-teal-300'>
            
            <div className='mt-4 flex flex-col gap-5' >
            <div className='w-full'>
              <div className='text-3xl'>
                Sign In
              </div>
              <div className='text-lg'>
                Please sign in to your Account.
              </div>
            </div>
              <div className='mb-4'>
                <input
                  type='text'
                  id='email'
                  placeholder='Email'
                  className='w-full sm:w-[25rem] border-b-2 border-black focus:outline-none focus:border-teal-500 py-1'
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className='mb-4'>
                <input
                  type='password'
                  id='password'
                  placeholder='Password'
                  className='w-full sm:w-[25rem] border-b-2 border-black focus:outline-none focus:border-teal-500 py-1'
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
            <button className='w-full sm:w-[25rem] h-12 bg-black text-white hover:border border-black hover:bg-teal-300 hover:text-black' onClick={handleSignIn}>
              SIGN IN
            </button>
          </div>
        </div>
        
        <div className='hidden sm:w-1/2 sm:flex'>
          <div className='flex items-center justify-center w-full'>
            <div className='w-2/3 mb-40 flex flex-col gap-10'>
              <div className='text-3xl'>
                Create an Account
              </div>
              <div>Save time during checkout, view your shopping bag and saved items from any device and access your order history.</div>
              <button className='w-full sm:w-[25rem] h-12 bg-black text-white hover:border border-black hover:bg-teal-300 hover:text-black' onClick={()=>{nav("/signup")}}>
              REGISTER
            </button>
            </div>
          </div>
        </div>
      </div>

      <div className='w-full border-t-8 border-teal-300 py-3 flex flex-col sm:flex-row justify-between'>
        <div className='w-full md:w-1/2 flex justify-between sm:px-10 font-bold'>
          <div>
            Contact Us
          </div>
          <div>
            Customer Care
          </div>
          <div>
            Related Stores
          </div>
        </div>
        <div className='w-full sm:w-1/2 flex justify-center items-center'>
          Latest Collection from Our Stores!
        </div>
      </div>
    </div>
  );
}

export default Login;
