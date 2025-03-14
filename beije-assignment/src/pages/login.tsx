import React, { useState, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  CssBaseline,
  Grid,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import Image from "next/image";
import { signIn } from "next-auth/react";

const validateEmailFormat = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let valid = true;
    if (!email) {
        setEmailError("E-posta alanı boş bırakılamaz!");
        valid = false;
    } else if (!validateEmailFormat(email)) {
        setEmailError("Geçerli bir e-posta adresi giriniz!");
        valid = false;
    } else {
        setEmailError("");
    }

    if (!password) {
        setPasswordError("Şifre alanı boş bırakılamaz!");
        valid = false;
    } else {
        setPasswordError("");
    }

    if (!valid) return;

    const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
    });

    if (result?.error) {
        console.log("Giriş başarısız:", result.error);
        setPasswordError("Giriş başarısız! Lütfen bilgilerinizi kontrol edin.");
    } else {
        console.log("Giriş başarılı!");
        window.location.href = result?.url || "/create-package";
    }
};

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh", position: "relative" }}>
      <CssBaseline />
      <Container component="main" maxWidth="md" sx={{ color: "black", pb: 10 }}>
        <Grid container spacing={10} sx={{ mt: 2, alignItems: "center" }}>
          <Grid item xs={48} md={6} sx={{ display: { xs: "none", md: "-webkit-flex" } }}>
            <Box sx={{ position: "relative", width: "80%", height: "calc(100vh - 164px)" }}>
              <Image src="/loginimages.png" alt="Login Visual" fill style={{ objectFit: "cover" }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Typography component="h1" variant="h5" align="center" sx={{ mb: 1, color: "black" }}>
                Merhaba
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3, color: "black" }}>
                beije'e hoş geldin
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                <Button variant="contained" color="primary">
                  Giriş Yap
                </Button>
                <Button variant="outlined" color="primary">
                  Üye Ol
                </Button>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", width: "70%", mb: 2, gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<GoogleIcon />}
                  sx={{
                    borderRadius: "50px",
                    minWidth: "40px",
                    height: "40px",
                    padding: "8px",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  onClick={() => signIn("google")}
                >
                  Google
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FacebookIcon />}
                  sx={{
                    borderRadius: "50px",
                    minWidth: "40px",
                    height: "40px",
                    padding: "8px",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  onClick={() => signIn("facebook")}
                >
                  Facebook
                </Button>
              </Box>
              <Divider sx={{ width: "100%", mb: 3 }} />
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="E-mail Adresin"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  inputRef={emailInputRef}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Şifren"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!passwordError}
                  helperText={passwordError}
                  inputRef={passwordInputRef}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                  <Link href="#" variant="body2">
                    Şifremi Unuttum
                  </Link>
                </Box>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 2 }}>
                  Giriş Yap
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;
