import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import AuthContext from "../context/AuthContext";

const Register = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, error, clearErrors, isAuthenticated } = authContext;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // 註冊成功後導向儀表板
    }

    if (error) {
      alert(error); // 簡單用 alert 顯示錯誤
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, navigate]);

  const [user, setUser] = useState({
    username: "",
    password: "",
    password2: "",
  });

  const { username, password, password2 } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      alert("請填寫所有欄位");
    } else if (password !== password2) {
      alert("兩次密碼輸入不一致");
    } else {
      register({
        username,
        password,
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: "bold" }}>
          AssetX
        </Typography>
        <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            autoComplete="off"
            name="username"
            required
            fullWidth
            id="username"
            label="使用者名稱"
            autoFocus
            value={username}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="密碼"
            type="password"
            id="password"
            autoComplete="off"
            value={password}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password2"
            label="確認密碼"
            type="password"
            id="password2"
            autoComplete="off"
            value={password2}
            onChange={onChange}
            inputProps={{
              minLength: 6,
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            註冊
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                已經有帳戶了？ 登入
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
