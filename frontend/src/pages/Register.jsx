import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, error, clearErrors, isAuthenticated } = authContext;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // 註冊成功後導向儀表板
    }

    if (error) {
      alert(error); // 簡單用 alert 顯示錯誤
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, navigate]);

  const [user, setUser] = useState({
    username: '',
    password: '',
    password2: ''
  });

  const { username, password, password2 } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (username === '' || password === '') {
      alert('請填寫所有欄位');
    } else if (password !== password2) {
      alert('兩次密碼輸入不一致');
    } else {
      register({
        username,
        password
      });
    }
  };

  return (
    <div className='form-container'>
      <h1>
        帳戶 <span className='text-primary'>註冊</span>
      </h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='username'>使用者名稱</label>
          <input
            id='username'
            type='text'
            name='username'
            value={username}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>密碼</label>
          <input
            id='password'
            type='password'
            name='password'
            value={password}
            onChange={onChange}
            required
            minLength='6'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password2'>確認密碼</label>
          <input
            id='password2'
            type='password'
            name='password2'
            value={password2}
            onChange={onChange}
            required
            minLength='6'
          />
        </div>
        <input
          type='submit'
          value='註冊'
          className='btn btn-primary btn-block'
        />
      </form>
    </div>
  );
};

export default Register; 