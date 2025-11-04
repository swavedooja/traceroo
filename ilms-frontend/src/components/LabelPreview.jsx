import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function LabelPreview({ level }) {
  if (!level) return null;
  const label = level.labelTemplate || 'SAMPLE_LABEL';
  const gtin = level.gtinFormat || 'GTIN-XXXX';
  return (
    <Card variant="outlined" sx={{ minWidth: 260 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">Sample Label</Typography>
        <Box sx={{ fontFamily: 'monospace', border: '1px dashed #cbd5e1', p: 2, mt: 1 }}>
          <Typography variant="h6">{label}</Typography>
          <Typography variant="body2">{level.levelName} • {level.levelCode}</Typography>
          <Typography variant="body2">GTIN: {gtin}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
