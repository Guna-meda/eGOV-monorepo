import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router';
import { Box, Typography, Button, Container } from '@mui/material';

export default function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError();

  // 1. Setup default fallback values
  let title = "An Unexpected Error Occurred";
  let message = "Something went wrong on our end. Please try again later.";
  let statusCode: string | number = "Error";

  // 2. Extract dynamic data based on the type of error caught
  if (isRouteErrorResponse(error)) {
    // Catches 404, 401, 500 responses thrown from loaders or actions
    statusCode = error.status;
    title = error.statusText || "Route Error";
    message = typeof error.data === "string" 
      ? error.data 
      : error.data?.message || message;

    // Contextual cleanups for common routing issues
    if (error.status === 404) {
      title = "Page Not Found";
      message = "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.";
    }
  } else if (error instanceof Error) {
    // Catches standard client-side JavaScript runtime crashes
    statusCode = "500";
    title = error.name;
    message = error.message;
  }

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
            fontSize: { xs: '5rem', sm: '8rem' },
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
          <Typography variant="h4" component="h2">
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