import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  CircularProgress,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { MaterialsAPI } from '../services/APIService';

export default function MaterialList() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ content: [], totalElements: 0 });

  const load = async () => {
    setLoading(true);
    try {
      const res = await MaterialsAPI.list({ page, size: rowsPerPage, search: query });
      // Normalize: accept either Spring Page or plain array
      const normalized = Array.isArray(res)
        ? { content: res, totalElements: res.length }
        : (res && typeof res === 'object')
          ? { content: res.content ?? [], totalElements: res.totalElements ?? (res.content?.length ?? 0) }
          : { content: [], totalElements: 0 };
      setData(normalized);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, rowsPerPage]);

  const onSearch = () => { setPage(0); load(); };

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="h6" sx={{ flex: 1, fontWeight: 700 }}>Materials</Typography>
        <TextField size="small" placeholder="Search code or name" value={query} onChange={(e)=>setQuery(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && onSearch()} />
        <IconButton color="primary" onClick={onSearch}><SearchIcon /></IconButton>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
      ) : (
        <>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Base UOM</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(data?.content ?? []).map((m)=> (
                <TableRow key={m.materialCode} hover>
                  <TableCell>{m.materialCode}</TableCell>
                  <TableCell>{m.materialName}</TableCell>
                  <TableCell>{m.sku}</TableCell>
                  <TableCell>{m.type}</TableCell>
                  <TableCell>{m.baseUOM}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={()=> navigate(`/materials/${m.materialCode}`)}>Open</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={data?.totalElements ?? (data?.content?.length ?? 0)}
            page={page}
            onPageChange={(_, p)=> setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e)=> { setRowsPerPage(parseInt(e.target.value,10)); setPage(0); }}
          />
        </>
      )}
    </Paper>
  );
}
