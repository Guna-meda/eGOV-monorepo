import { useNavigate } from 'react-router';
import { Box, Typography, Button, Container } from '@mui/material';

interface ErrorPageProps {
  title?: string;
  message?: string;
  statusCode?: string | number;
}

export default function ErrorPage({ 
  title = "Page Not Found", 
  message = "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
  statusCode = "404"
}: ErrorPageProps){
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          px: 3,
        }}
      >
        {/* Large Status Code Watermark */}
        <Typography
          variant="h1"
          component="div"
          sx={{
            fontSize: { xs: '6rem', sm: '10rem' },
            fontWeight: 900,
            backgroundImage: (theme) => `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.warning.main})`,
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            mb: 2,
          }}
        >
          {statusCode}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Typography variant="h4">
            {title}
          </Typography>
        </Box>

        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ maxWidth: '500px', mb: 4 }}
        >
          {message}
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button 
            variant="outlined" 
            color="inherit" 
            onClick={() => navigate(-1)}
            sx={{ minWidth: '140px' }}
          >
            Go Back
          </Button>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/')}
            sx={{ minWidth: '140px' }}
          >
            Back to Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
