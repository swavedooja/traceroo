import React, { useRef, useState } from 'react';
import { Box, Button, LinearProgress } from '@mui/material';

export default function FileUploader({ accept, onUpload }) {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handlePick = () => inputRef.current?.click();
  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <Box>
      <input type="file" ref={inputRef} style={{ display: 'none' }} accept={accept} onChange={handleChange} />
      <Button variant="outlined" onClick={handlePick} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
      {uploading && <LinearProgress sx={{ mt: 1 }} />}
    </Box>
  );
}
