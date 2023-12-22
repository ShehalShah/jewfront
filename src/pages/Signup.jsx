import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, database } from '../firebaseConfig'; 
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const nav = useNavigate()
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const newUser = userCredential.user;

      const userRef = doc(database, 'users', newUser.uid);
      await setDoc(userRef, {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
      });

      console.log('User signed up:', newUser);
      setName("")
      setPassword("")
      setPhoneNumber("")
      setEmail("")
      nav("/login")
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  return (
    <div className='h-screen flex flex-col'>
      <Navbar />
      <div className='flex-grow w-full flex'>
        {/* Left Section - Centered */}
        <div className='w-full h-full flex items-center justify-center'>
          <div className='sm:w-full items-center flex flex-col gap-4 mb-20'>

            <div className='mt-4 flex flex-col gap-5' >
              <div className='w-full'>
                <div className='text-3xl'>
                  Sign Up
                </div>
                <div className='text-lg'>
                  Create a new account to access exclusive offers.
                </div>
              </div>
              <div className='mb-4'>
                <input
                  type='text'
                  id='name'
                  placeholder='Name'
                  className='w-full sm:w-[25rem] border-b-2 border-black focus:outline-none focus:border-teal-500 py-1'
                  value={name}
                  onChange={handleNameChange}
                />
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
                  type='text'
                  id='phone'
                  placeholder='Phone Number'
                  className='w-full sm:w-[25rem] border-b-2 border-black focus:outline-none focus:border-teal-500 py-1'
                  value={phoneNumber}
                  onChange={(e) => {
                    const inputText = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                    setPhoneNumber(inputText);
                }}
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
            <button className='w-full sm:w-[25rem] h-12 bg-black text-white hover:border border-black hover:bg-teal-300 hover:text-black' onClick={handleSignup}>
              REGISTER
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className='w-full border-t-8 border-teal-300 py-3 flex flex-col sm:flex-row justify-between'>
        <div className='w-full sm:w-1/2 flex justify-between sm:px-10 font-bold'>
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
};

export default Signup;
