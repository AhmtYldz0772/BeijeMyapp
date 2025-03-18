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
  Snackbar,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import Image from "next/image";
import { signIn } from "next-auth/react";
import axios from "axios";
import { useDispatch } from "react-redux";
// Artık profileSlice yerine authSlice'dan setProfile'yı import ediyoruz
import { setProfile } from "../slices/authSlice";

const validateEmailFormat = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [activeTab, setActiveTab] = useState<"giris" | "uye">("giris");

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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

    // Sign In Request
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      console.log("Giriş başarısız:", result.error);
      setPasswordError("Giriş başarısız! Lütfen bilgilerinizi kontrol edin.");
      setSnackbarMessage("Hatalı e-posta veya şifre. Lütfen kontrol edin.");
      setSnackbarOpen(true);
    } else if (result?.ok) {
      console.log("Giriş başarılı!");
      // Token'ı alıyoruz
      const token = (result as any)?.data?.token;
      if (token) {
        try {
          // Get Profile API çağrısı
          const profileResponse = await axios.get(
            "https://96318a87-0588-4da5-9843-b3d7919f1782.mock.pstmn.io/profile",
            { headers: { "x-auth-token": token } }
          );
          if (profileResponse.data?.success) {
            // Profil bilgisini Redux store'a kaydet (authSlice üzerinden)
            dispatch(setProfile(profileResponse.data.data));
            setSnackbarMessage("Giriş başarılı!");
            setSnackbarOpen(true);
            // Yönlendirme
            window.location.href = profileResponse.data?.url || "/create-package";
          } else {
            setSnackbarMessage("Profil bilgisi alınamadı.");
            setSnackbarOpen(true);
          }
        } catch (error) {
          console.error("Profil API çağrısında hata:", error);
          setSnackbarMessage("Profil bilgisi alınırken hata oluştu.");
          setSnackbarOpen(true);
        }
      } else {
        setSnackbarMessage("Token alınamadı.");
        setSnackbarOpen(true);
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      <CssBaseline />
      <Container component="main" maxWidth="xl" disableGutters sx={{ pb: 10 }}>
        <Grid container sx={{ minHeight: "calc(100vh - 120px)" }}>
        
          <Grid item xs={12} md={6}>
            <Box sx={{ position: "relative", width: "100%", height: "900px" }}>
              <Image
                src="/loginimages.png"
                alt="Login Visual"
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 4,
              }}
            >
              
              <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                <Button
                  onClick={() => setActiveTab("giris")}
                  sx={{
                    borderBottom: activeTab === "giris" ? "2px solid black" : "none",
                    textTransform: "none",
                    fontWeight: activeTab === "giris" ? "bold" : "normal",
                  }}
                >
                  Giriş Yap
                </Button>
                <Button
                  onClick={() => setActiveTab("uye")}
                  sx={{
                    borderBottom: activeTab === "uye" ? "2px solid black" : "none",
                    textTransform: "none",
                    fontWeight: activeTab === "uye" ? "bold" : "normal",
                  }}
                >
                  Üye Ol
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "70%",
                  mb: 2,
                  gap: 1,
                }}
              >
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
              {activeTab === "giris" ? (
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
              ) : (
                <Box sx={{ mt: 1, width: "100%" }}>
                  <Typography variant="body1" align="center">
                    Üye Ol formu gelecek...
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default LoginPage;
