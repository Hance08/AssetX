import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const { username, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    // 在這裡處理登入邏輯
    console.log('Login attempt:', formData);
  };

  return (
    <div>
      <h1>登入</h1>
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
        <input type="submit" value="登入" />
      </form>
    </div>
  );
};

export default Login; 