import React, { useState, useMemo } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    MenuItem,
    Slider,
    FormControl,
    InputLabel,
    Select,
    Divider,
    Chip,
    Alert,
} from '@mui/material';
import { Calculate, Print, Straighten } from '@mui/icons-material';

// Standard paper sizes in mm
const PAPER_SIZES = {
    'A4': { width: 210, height: 297, label: 'A4 (210 × 297 mm)' },
    'A3': { width: 297, height: 420, label: 'A3 (297 × 420 mm)' },
    'Letter': { width: 216, height: 279, label: 'Letter (8.5" × 11")' },
    'Legal': { width: 216, height: 356, label: 'Legal (8.5" × 14")' },
    'Custom': { width: 100, height: 100, label: 'Custom Size' }
};

// Common label preset sizes
const LABEL_PRESETS = [
    { name: '2" × 1"', width: 50.8, height: 25.4 },
    { name: '4" × 2"', width: 101.6, height: 50.8 },
    { name: '4" × 6"', width: 101.6, height: 152.4 },
    { name: '3" × 2"', width: 76.2, height: 50.8 },
    { name: '50 × 30 mm', width: 50, height: 30 },
    { name: '100 × 50 mm', width: 100, height: 50 },
    { name: '100 × 100 mm', width: 100, height: 100 },
];

export default function LabelPreview({
    labelWidth: propLabelWidth = 100,
    labelHeight: propLabelHeight = 50,
    onLayoutChange
}) {
    const [paperSize, setPaperSize] = useState('A4');
    const [customPaper, setCustomPaper] = useState({ width: 210, height: 297 });
    const [labelWidth, setLabelWidth] = useState(propLabelWidth);
    const [labelHeight, setLabelHeight] = useState(propLabelHeight);
    const [marginTop, setMarginTop] = useState(10);
    const [marginBottom, setMarginBottom] = useState(10);
    const [marginLeft, setMarginLeft] = useState(10);
    const [marginRight, setMarginRight] = useState(10);
    const [gutterH, setGutterH] = useState(3);
    const [gutterV, setGutterV] = useState(3);

    // Calculate paper dimensions
    const paper = useMemo(() => {
        if (paperSize === 'Custom') {
            return customPaper;
        }
        return PAPER_SIZES[paperSize];
    }, [paperSize, customPaper]);

    // Calculate printable area
    const printableArea = useMemo(() => ({
        width: paper.width - marginLeft - marginRight,
        height: paper.height - marginTop - marginBottom
    }), [paper, marginTop, marginBottom, marginLeft, marginRight]);

    // Calculate labels per sheet
    const labelsLayout = useMemo(() => {
        if (labelWidth <= 0 || labelHeight <= 0) {
            return { columns: 0, rows: 0, total: 0, waste: 0 };
        }

        const columns = Math.floor((printableArea.width + gutterH) / (labelWidth + gutterH));
        const rows = Math.floor((printableArea.height + gutterV) / (labelHeight + gutterV));
        const total = columns * rows;

        const usedWidth = columns * labelWidth + (columns - 1) * gutterH;
        const usedHeight = rows * labelHeight + (rows - 1) * gutterV;
        const totalArea = paper.width * paper.height;
        const usedArea = usedWidth * usedHeight;
        const waste = Math.round((1 - usedArea / totalArea) * 100);

        return { columns, rows, total, waste, usedWidth, usedHeight };
    }, [printableArea, labelWidth, labelHeight, gutterH, gutterV, paper]);

    // Calculate scale for preview
    const scale = useMemo(() => {
        const maxPreviewWidth = 300;
        return maxPreviewWidth / paper.width;
    }, [paper]);

    const handlePresetSelect = (preset) => {
        setLabelWidth(preset.width);
        setLabelHeight(preset.height);
    };

    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calculate color="primary" />
                Label Sheet Calculator
            </Typography>

            <Grid container spacing={3}>
                {/* Settings Column */}
                <Grid item xs={12} md={6}>
                    {/* Paper Size */}
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Paper Size
                    </Typography>
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <Select
                            value={paperSize}
                            onChange={(e) => setPaperSize(e.target.value)}
                        >
                            {Object.entries(PAPER_SIZES).map(([key, val]) => (
                                <MenuItem key={key} value={key}>{val.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {paperSize === 'Custom' && (
                        <Grid container spacing={1} sx={{ mb: 2 }}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Width (mm)"
                                    type="number"
                                    size="small"
                                    fullWidth
                                    value={customPaper.width}
                                    onChange={(e) => setCustomPaper(p => ({ ...p, width: Number(e.target.value) }))}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Height (mm)"
                                    type="number"
                                    size="small"
                                    fullWidth
                                    value={customPaper.height}
                                    onChange={(e) => setCustomPaper(p => ({ ...p, height: Number(e.target.value) }))}
                                />
                            </Grid>
                        </Grid>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* Label Size */}
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Label Size (mm)
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {LABEL_PRESETS.map((preset) => (
                            <Chip
                                key={preset.name}
                                label={preset.name}
                                size="small"
                                onClick={() => handlePresetSelect(preset)}
                                variant={labelWidth === preset.width && labelHeight === preset.height ? 'filled' : 'outlined'}
                                color={labelWidth === preset.width && labelHeight === preset.height ? 'primary' : 'default'}
                            />
                        ))}
                    </Box>
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                            <TextField
                                label="Width"
                                type="number"
                                size="small"
                                fullWidth
                                value={labelWidth}
                                onChange={(e) => setLabelWidth(Number(e.target.value))}
                                InputProps={{ endAdornment: 'mm' }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Height"
                                type="number"
                                size="small"
                                fullWidth
                                value={labelHeight}
                                onChange={(e) => setLabelHeight(Number(e.target.value))}
                                InputProps={{ endAdornment: 'mm' }}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Margins */}
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Page Margins (mm)
                    </Typography>
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                            <TextField label="Top" type="number" size="small" fullWidth value={marginTop} onChange={(e) => setMarginTop(Number(e.target.value))} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Bottom" type="number" size="small" fullWidth value={marginBottom} onChange={(e) => setMarginBottom(Number(e.target.value))} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Left" type="number" size="small" fullWidth value={marginLeft} onChange={(e) => setMarginLeft(Number(e.target.value))} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Right" type="number" size="small" fullWidth value={marginRight} onChange={(e) => setMarginRight(Number(e.target.value))} />
                        </Grid>
                    </Grid>

                    {/* Gutters */}
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Gap Between Labels (mm)
                    </Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <TextField label="Horizontal" type="number" size="small" fullWidth value={gutterH} onChange={(e) => setGutterH(Number(e.target.value))} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Vertical" type="number" size="small" fullWidth value={gutterV} onChange={(e) => setGutterV(Number(e.target.value))} />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Preview Column */}
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Sheet Preview
                    </Typography>

                    {/* Results Summary */}
                    <Box sx={{ mb: 2, p: 1.5, bgcolor: 'primary.light', borderRadius: 1 }}>
                        <Grid container spacing={1}>
                            <Grid item xs={4}>
                                <Typography variant="h4" fontWeight="bold" color="primary.contrastText" align="center">
                                    {labelsLayout.total}
                                </Typography>
                                <Typography variant="caption" color="primary.contrastText" align="center" display="block">
                                    Labels/Sheet
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="h4" fontWeight="bold" color="primary.contrastText" align="center">
                                    {labelsLayout.columns}×{labelsLayout.rows}
                                </Typography>
                                <Typography variant="caption" color="primary.contrastText" align="center" display="block">
                                    Grid Layout
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="h4" fontWeight="bold" color="primary.contrastText" align="center">
                                    {labelsLayout.waste}%
                                </Typography>
                                <Typography variant="caption" color="primary.contrastText" align="center" display="block">
                                    Sheet Waste
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Visual Preview */}
                    <Box
                        sx={{
                            width: paper.width * scale,
                            height: paper.height * scale,
                            bgcolor: 'white',
                            border: '2px solid',
                            borderColor: 'grey.400',
                            position: 'relative',
                            mx: 'auto',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                    >
                        {/* Printable area */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: marginTop * scale,
                                left: marginLeft * scale,
                                width: printableArea.width * scale,
                                height: printableArea.height * scale,
                                border: '1px dashed',
                                borderColor: 'grey.300'
                            }}
                        >
                            {/* Render labels */}
                            {Array.from({ length: labelsLayout.rows }).map((_, row) => (
                                Array.from({ length: labelsLayout.columns }).map((_, col) => (
                                    <Box
                                        key={`${row}-${col}`}
                                        sx={{
                                            position: 'absolute',
                                            top: row * (labelHeight + gutterV) * scale,
                                            left: col * (labelWidth + gutterH) * scale,
                                            width: labelWidth * scale,
                                            height: labelHeight * scale,
                                            bgcolor: 'primary.main',
                                            opacity: 0.7,
                                            borderRadius: 0.5,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'white',
                                                fontSize: Math.max(6, labelWidth * scale * 0.15),
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {row * labelsLayout.columns + col + 1}
                                        </Typography>
                                    </Box>
                                ))
                            ))}
                        </Box>
                    </Box>

                    {labelsLayout.total === 0 && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            Labels don't fit on the selected paper size. Try reducing label size or margins.
                        </Alert>
                    )}

                    {/* Dimensions info */}
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                        <Straighten sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                        Paper: {paper.width}×{paper.height}mm | Printable: {printableArea.width}×{printableArea.height}mm
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
}
