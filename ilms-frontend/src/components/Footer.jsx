import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer"
         sx={{
           px: 2,
           py: 1,
           textAlign: 'center',
           bgcolor: 'primary.main',
           color: 'primary.contrastText',
         }}>
      <Typography sx={{ fontSize: 12 }}>Powered by DOPS</Typography>
    </Box>
  );
}
