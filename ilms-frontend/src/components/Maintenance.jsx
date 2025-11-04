import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Maintenance() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <Typography variant="h5" sx={{ color: 'text.secondary' }}>
        Website is under maintenance
      </Typography>
    </Box>
  );
}
