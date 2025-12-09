import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    Button,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Alert,
    Snackbar,
    CircularProgress,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import {
    QrCode2,
    Add,
    Print,
    CheckCircle,
    Schedule,
    Refresh
} from '@mui/icons-material';
import { MaterialsAPI, SerialPoolAPI, LocationAPI } from '../../services/APIService';

export default function SerialGeneration() {
    const [materials, setMaterials] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    const [form, setForm] = useState({
        materialId: '',
        batchNumber: '',
        quantity: 10,
        locationId: ''
    });

    const [generatedSerials, setGeneratedSerials] = useState([]);
    const [serialStats, setSerialStats] = useState({ RESERVED: 0, ASSIGNED: 0, CONSUMED: 0, VOIDED: 0 });
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        loadMaterials();
        loadLocations();
    }, []);

    useEffect(() => {
        if (form.materialId) {
            loadSerialStats(form.materialId);
        }
    }, [form.materialId]);

    const loadMaterials = async () => {
        try {
            const data = await MaterialsAPI.list();
            setMaterials(data);
        } catch (e) {
            console.error('Failed to load materials', e);
        }
    };

    const loadLocations = async () => {
        try {
            const data = await LocationAPI.list();
            setLocations(data);
        } catch (e) {
            console.error('Failed to load locations', e);
        }
    };

    const loadSerialStats = async (materialId) => {
        try {
            const stats = await SerialPoolAPI.getCountsByStatus(materialId);
            setSerialStats(stats);
        } catch (e) {
            console.error('Failed to load serial stats', e);
        }
    };

    const handleGenerateSerials = async () => {
        if (!form.materialId || !form.batchNumber || form.quantity < 1) {
            setToast({ open: true, message: 'Please fill all required fields', severity: 'error' });
            return;
        }

        setGenerating(true);
        try {
            const serials = await SerialPoolAPI.reserveSerials(
                form.materialId,
                form.batchNumber,
                form.quantity,
                'System' // TODO: Replace with actual user
            );

            setGeneratedSerials(serials);
            setToast({
                open: true,
                message: `Successfully generated ${serials.length} serial numbers`,
                severity: 'success'
            });

            // Reload stats
            loadSerialStats(form.materialId);
        } catch (e) {
            console.error('Failed to generate serials', e);
            setToast({
                open: true,
                message: `Failed to generate serials: ${e.message}`,
                severity: 'error'
            });
        } finally {
            setGenerating(false);
        }
    };

    const handleLoadExisting = async () => {
        if (!form.batchNumber) {
            setToast({ open: true, message: 'Please enter a batch number', severity: 'warning' });
            return;
        }

        setLoading(true);
        try {
            const serials = await SerialPoolAPI.getByBatch(form.batchNumber);
            setGeneratedSerials(serials);
            if (serials.length === 0) {
                setToast({ open: true, message: 'No serials found for this batch', severity: 'info' });
            }
        } catch (e) {
            console.error('Failed to load serials', e);
        } finally {
            setLoading(false);
        }
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            RESERVED: { color: 'warning', icon: <Schedule fontSize="small" /> },
            ASSIGNED: { color: 'info', icon: <Schedule fontSize="small" /> },
            CONSUMED: { color: 'success', icon: <CheckCircle fontSize="small" /> },
            VOIDED: { color: 'error', icon: null }
        };
        const config = statusConfig[status] || { color: 'default' };
        return (
            <Chip
                label={status}
                size="small"
                color={config.color}
                icon={config.icon}
            />
        );
    };

    const selectedMaterial = materials.find(m => m.id === form.materialId);

    return (
        <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <QrCode2 color="primary" /> Serial Number Generation
            </Typography>

            <Grid container spacing={3}>
                {/* Left: Form */}
                <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                            Generate New Serials
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    label="Material *"
                                    fullWidth
                                    value={form.materialId}
                                    onChange={(e) => setForm({ ...form, materialId: e.target.value })}
                                >
                                    {materials.map((m) => (
                                        <MenuItem key={m.id} value={m.id}>
                                            {m.name} ({m.code})
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Batch Number *"
                                    fullWidth
                                    value={form.batchNumber}
                                    onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
                                    placeholder="e.g., BATCH-2024-001"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    type="number"
                                    label="Quantity *"
                                    fullWidth
                                    value={form.quantity}
                                    onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                                    inputProps={{ min: 1, max: 1000 }}
                                    helperText="Max 1000 per batch"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    select
                                    label="Default Location"
                                    fullWidth
                                    value={form.locationId}
                                    onChange={(e) => setForm({ ...form, locationId: e.target.value })}
                                >
                                    <MenuItem value="">None</MenuItem>
                                    {locations.map((l) => (
                                        <MenuItem key={l.id} value={l.id}>
                                            {l.name} ({l.code})
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={generating ? <CircularProgress size={20} color="inherit" /> : <Add />}
                                    onClick={handleGenerateSerials}
                                    disabled={generating}
                                    size="large"
                                >
                                    {generating ? 'Generating...' : 'Generate Serials'}
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }}>OR</Divider>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<Refresh />}
                                    onClick={handleLoadExisting}
                                    disabled={loading}
                                >
                                    Load Existing Batch
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Stats Card */}
                    {form.materialId && (
                        <Card sx={{ mt: 2 }} variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                    Serial Pool Stats for {selectedMaterial?.name}
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Chip label={`Reserved: ${serialStats.RESERVED}`} color="warning" size="small" sx={{ width: '100%' }} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Chip label={`Consumed: ${serialStats.CONSUMED}`} color="success" size="small" sx={{ width: '100%' }} />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )}
                </Grid>

                {/* Right: Generated Serials Table */}
                <Grid item xs={12} md={8}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Generated Serial Numbers ({generatedSerials.length})
                            </Typography>
                            {generatedSerials.length > 0 && (
                                <Button startIcon={<Print />} variant="outlined" size="small">
                                    Print Labels
                                </Button>
                            )}
                        </Box>

                        {generatedSerials.length === 0 ? (
                            <Alert severity="info">
                                No serial numbers generated yet. Fill the form and click "Generate Serials" to create a new batch.
                            </Alert>
                        ) : (
                            <TableContainer sx={{ maxHeight: 400 }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>#</TableCell>
                                            <TableCell>Serial Number</TableCell>
                                            <TableCell>Batch</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Reserved At</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {generatedSerials.map((serial, index) => (
                                            <TableRow key={serial.id} hover>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontFamily="monospace" fontWeight="bold">
                                                        {serial.serial_number}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{serial.batch_number}</TableCell>
                                                <TableCell>{getStatusChip(serial.status)}</TableCell>
                                                <TableCell>
                                                    {serial.reserved_at ? new Date(serial.reserved_at).toLocaleString() : '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>

                    {/* Serial Format Info */}
                    <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            <strong>Serial Format:</strong> SN-DDMMYYYY-XXXXX (e.g., SN-09122024-00001)
                        </Typography>
                    </Alert>
                </Grid>
            </Grid>

            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast({ ...toast, open: false })}
            >
                <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
