import React from "react";
import { Box, Container, Grid, Typography, TextField, Button, Link } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
//import SpotifyIcon from "@mui/icons-material/Spotify"; // Bu ikon MUI'da bulamadım belki başkabiryerden ekleyebilirsin Ahmet , 

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: "#212121", color: "#fff", pt: 4, pb: 2 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Arayı açmayalım!
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              beije’deki yeni ürün ve gelişmeleri sana haber verelim & aylık e-gazetemiz döngü’ye abone ol!
            </Typography>
            <Box component="form" noValidate sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="e-mail adresin"
                sx={{ flex: 1, backgroundColor: "#fff", borderRadius: 1 }}
              />
              <Button variant="contained"  sx={{
                    backgroundColor: "#ffff",
                    color: "black",
                    borderRadius: "50px"}}>
                Gönder
              </Button>
            </Box>
            <Typography variant="caption" sx={{ display: "block", mb: 2 }}>
              Abone olarak, beije KVKK ve Gizlilik Politikası'nı kabul ediyor ve beije'den haber almayı onaylıyorum.
            </Typography>
          </Grid>

          
          <Grid item xs={6} md={2}>
            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
              beije Ped
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Blog
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
              beije Günlük Ped
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Sıkça Sorulan Sorular
            </Typography>
            
          </Grid>
          <Grid item xs={6} md={2}>
            
            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
              beije Tampon
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Biz Kimiz?
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              beije Store
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Quiz
            </Typography>
          </Grid>

          
          <Grid item xs={12} md={4}>
            
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <FacebookIcon />
              <Typography variant="body2">Facebook</Typography>
            </Box>

            
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <InstagramIcon />
              <Typography variant="body2">Instagram</Typography>
            </Box>

            
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <TwitterIcon />
              <Typography variant="body2">Twitter</Typography>
            </Box>

            
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <LinkedInIcon />
              <Typography variant="body2">Linkedin</Typography>
            </Box>

            
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            
              
              <Typography variant="body2">Spotify</Typography>
            </Box>
          </Grid>
        </Grid>

        
        <Box sx={{ mt: 4, borderTop: "1px solid #555", pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={24} md={12}>
              <Typography variant="caption">
                2025 beije. Tüm hakları saklıdır.
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "revert-layer", gap: 16, mt: 1 }}>
                <Typography variant="caption">KVKK</Typography>
                <Typography variant="caption">KVKK Başvuru Formu</Typography>
                <Typography variant="caption">Üyelik Sözleşmesi</Typography>
                <Typography variant="caption">Gizlilik Politikası</Typography>
                <Typography variant="caption">Çerez Politikası</Typography>
                <Typography variant="caption">Test Sonuçları</Typography>
              </Box>
            </Grid>
            
          </Grid>
        </Box>
        <Box sx={{ mt: 4, pt: 8 }}>
        <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                
                <Typography variant="caption">|</Typography>
                <Typography variant="caption">TROY</Typography>
                <Typography variant="caption">MasterCard</Typography>
                <Typography variant="caption">VISA</Typography>
                <Typography variant="caption">American Express</Typography>
                <Typography variant="caption">ETBIS</Typography>
              </Box>
            </Grid>
        </Box>
      </Container>
    </Box>
  );
}
