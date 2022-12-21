import React from 'react';
import { useState, useEffect, useRef } from 'react';

import {
  faCheck,
  faTimes,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import axios from 'axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function RegistrationPage(props) {
  const userRef = useRef();
  const errRef = useRef();

  const [userName, setUserName] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const [confirmPassword, setconfirmPassword] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);


    useEffect( () => {
        setValidName(USER_REGEX.test(userName))
    }, [userName]) //do we want the result on  cnsole? 


    useEffect( () => {
        setValidPassword(PASSWORD_REGEX.test(password))  

        password === confirmPassword ? setValidMatch(true) : setValidMatch(false)

    }, [password, confirmPassword])

    useEffect( () => {
        setErrMsg('')
    }, [userName, password, confirmPassword, email, firstName, lastName])

  const handleRegistration = async (e) => {
    e.preventDefault();

    const userValid = USER_REGEX.test(userName);
    const passwordValid = PASSWORD_REGEX.test(password);
    if (!userValid || !passwordValid) {
      setErrMsg('Invalid Entry');
      return;
    }
    try {
      const response = await axios.post(
        '/users/signup',
        JSON.stringify({
          userName,
          password,
          email,
          firstName,
          lastName,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      console.log(response?.data);
      console.log(response?.accessToken);
      console.log(JSON.stringify(response));
      setSuccess(true);
      //clear state and controlled inputs
      //need value attrib on inputs for this
      setUserName('');
      setPassword('');
      setconfirmPassword('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else {
        setErrMsg('Registration Failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <>
        <div className='flex flex-col items-center text-center p-20 bg-cyan-900' >   
        <div  className='bg-white w-fit pl-8 pr-8 pb-5 pt-5'>
            <h2 className=' text-red-900 font-bold shadow-sm' > Begin your companies online expansion! </h2>
            
            <p ref={errRef} 
            aria-live="assertive" 
            className={`${ errMsg ? "errmsg" : "offscreen"}`} 
            > 
                {errMsg} 
            </p>

            <form onSubmit={handleRegistration} className='flex flex-col items-center'>

                <div className='firstNameInputField w-full pl-9 p-2' >
                    <input  onChange={(e) => setFirstName(e.target.value)} 
                            type="text" 
                            name="firstName" 
                            placeholder='First Name...' 
                            required
                            className=' bg-slate-200 w-9/12 ml-4 mb-3' 
                    /> 
                </div>

                <div className='lastNameInputField w-full pl-9 p-2' >
                    <input  onChange={(e) => setLastName(e.target.value)} 
                            type="text" 
                            name="lastName" 
                            placeholder='Last Name...' 
                            required
                            className=' bg-slate-200 w-9/12 ml-4 mb-3' 
                    /> 
                </div>

                <div className='usernameInputField w-full p-2' >
                    <label htmlFor='userName' className='p-2'>
                        <span className={validName ? "visible" : "invisible"}>
                            <FontAwesomeIcon icon={faCheck}  />
                        </span>
                        <span className={validName ? "invisible" : "visible"}>
                            <FontAwesomeIcon icon={faTimes}  />
                        </span>
                    </label>
                    <input  type="text"
                            placeholder='Username...'  
                            name="username" 
                            id="userName"
                            ref={userRef}
                            autoComplete="off"
                            value={userName}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onChange={(e) => setUserName(e.target.value)}
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                            
                            className=' bg-slate-200 w-8/12 mb-3'
                    /> 
                    <p id="uidnote" className={`${userFocus && userName && !validName ? "visible text-left pl-34 flex-wrap" : "invisible p-0 m-0 h-0 w-0"} `}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores,<br />
                             hyphens allowed.
                    </p>
                </div>

                <div className='emailInputField w-full pl-9 p-2' > 
                    <input  onChange={ (e) => setEmail(e.target.value)} 
                            type="email" 
                            name="email" 
                            placeholder='Email...' 
                            
                            className='bg-slate-200 w-9/12 ml-4 mb-3'
                    /> 
                </div>

                <div className='passwordInputField w-full p-2'> 
                    <label htmlFor='password' className='p-2' >
                            <FontAwesomeIcon icon={faCheck} className={validPassword ? "visible" : "invisible"} />
                            <FontAwesomeIcon icon={faTimes} className={validPassword ? "invisible" : "visible"} />     
                    </label>
                    <input onChange={(e) => setPassword(e.target.value)} 
                            type="password" 
                            name="password" 
                            id="password"
                            placeholder='Password...'
                            value={password}
                            required
                            aria-invalid={validPassword ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                            className=' bg-slate-200 w-8/12 mb-3'
                    /> 


                    <p id="pwdnote" className={`${passwordFocus && !validPassword ? "visible text-left pl-30" : "invisible p-0 m-0 h-0 w-0"}`}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                                8 to 24 characters.<br />
                                Must include uppercase and lowercase <br />
                                letters, a number and a special 
                                character.<br />
                                Allowed special characters: 
                                <span aria-label="exclamation mark"> !</span> 
                                <span aria-label="at symbol">@</span> 
                                <span aria-label="hashtag">#</span> 
                                <span aria-label="dollar sign">$</span> 
                                <span aria-label="percent">%</span>
                    </p>
                </div>
    
                <div className='pswConfirmInputField w-full p-2'>

                    <label htmlFor="confirm_password" className='p-2' >
                        <FontAwesomeIcon icon={faCheck} className={validMatch && confirmPassword ? "visible" : "invisible"} />
                        <FontAwesomeIcon icon={faTimes} className={!validMatch || !confirmPassword ? "visible" : "invisible"} />
                    </label>

                    <input  onChange={(e) => setconfirmPassword(e.target.value)} 
                            type="password" 
                            name="confirmPassword" 
                            id="confirm_password"
                            placeholder='Confirm Password...' 
                            // value={confirmPassword}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}


                            className=' bg-slate-200 w-8/12 mb-3'
                    /> 

                    <p id="confirmnote" className={matchFocus && !validMatch ? "visible text-left pl-30" : "invisible p-0 m-0 h-0 w-0"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                    </p>
                </div>
                    
                <button className=' bg-red-800 w-4/12 text-gray-200 self-center p-2'
                        disabled={!validName || !validPassword || !validMatch ? true : false} > 
                    Register 
                </button>

            </form>
        </div>
        </div>
    </>
)
}


//             {success ? (
//                 <section>
//                     <h1>Success!</h1>
//                     <p>
//                         <a href="#">Sign In</a>
//                     </p>
//                 </section>
//             ) : (

//       <button >Sign Up</button>
//
//        <p>
//           Already registered?<br />
//               <span className="line">
//               {/*put router link here*/}
//               <a href="#">Sign In</a>
//           </span>
//         </p>
