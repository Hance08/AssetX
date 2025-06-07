import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password2: ''
  });

  const { username, password, password2 } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (password !== password2) {
      console.log('Passwords do not match');
    } else {
      // 在這裡處理註冊邏輯
      console.log('Register attempt:', { username, password });
    }
  };

  return (
    <div>
      <h1>註冊</h1>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="使用者名稱"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="密碼"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="確認密碼"
            name="password2"
            value={password2}
            onChange={onChange}
            required
          />
        </div>
        <input type="submit" value="註冊" />
      </form>
    </div>
  );
};

export default Register; 