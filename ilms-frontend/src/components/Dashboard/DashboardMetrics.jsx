import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Alert,
    CircularProgress,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Button,
    IconButton
} from '@mui/material';
import {
    Inventory2,
    LocalShipping,
    Archive,
    CheckCircle,
    Warning,
    Error as ErrorIcon,
    Schedule,
    Refresh,
    TrendingUp,
    QrCode2,
    Timeline
} from '@mui/icons-material';
import { DashboardAPI } from '../../services/APIService';

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card
        variant="outlined"
        sx={{
            height: '100%',
            background: `linear-gradient(135deg, ${color}15, ${color}05)`,
            borderColor: `${color}30`
        }}
    >
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ color }}>
                        {value?.toLocaleString() || 0}
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                <Box
                    sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,
                        bgcolor: `${color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Icon sx={{ fontSize: 28, color }} />
                </Box>
            </Box>
        </CardContent>
    </Card>
);

// Stage Progress Component
const StageProgress = ({ stages }) => {
    const colors = {
        PRE_INVENTORY: '#ff9800',
        ACTIVE: '#4caf50',
        PACKED: '#2196f3',
        SHIPPED: '#9c27b0',
        DELIVERED: '#00bcd4'
    };

    return (
        <Box>
            {stages.map((stage, index) => (
                <Box key={stage.stage} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{stage.stage}</Typography>
                        <Typography variant="body2" fontWeight="bold">
                            {stage.count} ({stage.percentage}%)
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={stage.percentage}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: `${colors[stage.stage] || '#999'}30`,
                            '& .MuiLinearProgress-bar': {
                                bgcolor: colors[stage.stage] || '#999'
                            }
                        }}
                    />
                </Box>
            ))}
        </Box>
    );
};

// Alert Item Component
const AlertItem = ({ alert }) => {
    const severityConfig = {
        ERROR: { color: 'error', icon: <ErrorIcon color="error" /> },
        WARNING: { color: 'warning', icon: <Warning color="warning" /> },
        INFO: { color: 'info', icon: <Schedule color="info" /> }
    };

    const config = severityConfig[alert.severity] || severityConfig.INFO;

    return (
        <ListItem
            sx={{
                bgcolor: `${config.color}.light`,
                borderRadius: 1,
                mb: 1
            }}
        >
            <ListItemIcon sx={{ minWidth: 40 }}>
                {config.icon}
            </ListItemIcon>
            <ListItemText
                primary={alert.description}
                secondary={`${alert.reference} • ${new Date(alert.timestamp).toLocaleString()}`}
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                secondaryTypographyProps={{ variant: 'caption' }}
            />
        </ListItem>
    );
};

// Event Item Component
const EventItem = ({ event }) => (
    <ListItem sx={{ px: 0 }}>
        <ListItemIcon sx={{ minWidth: 40 }}>
            <QrCode2 color="primary" fontSize="small" />
        </ListItemIcon>
        <ListItemText
            primary={event.event_type}
            secondary={`${event.inventory?.serial_number || event.container?.serial_number || 'N/A'} • ${new Date(event.event_timestamp || event.created_at).toLocaleTimeString()}`}
            primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
            secondaryTypographyProps={{ variant: 'caption' }}
        />
        <Chip
            label={event.status || 'SUCCESS'}
            size="small"
            color={event.status === 'SUCCESS' ? 'success' : 'default'}
        />
    </ListItem>
);

export default function DashboardMetrics() {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState(null);
    const [stages, setStages] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [recentEvents, setRecentEvents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [metricsData, stagesData, alertsData, eventsData] = await Promise.all([
                DashboardAPI.getMetrics(),
                DashboardAPI.getInventoryByStage(),
                DashboardAPI.getAlerts(10),
                DashboardAPI.getRecentEvents(10)
            ]);

            setMetrics(metricsData);
            setStages(stagesData || []);
            setAlerts(alertsData || []);
            setRecentEvents(eventsData || []);
        } catch (e) {
            console.error('Failed to load dashboard data', e);
            setError('Failed to load dashboard data. Some widgets may show partial information.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">
                    <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Operations Dashboard
                </Typography>
                <Button
                    startIcon={<Refresh />}
                    onClick={loadDashboardData}
                    variant="outlined"
                    size="small"
                >
                    Refresh
                </Button>
            </Box>

            {error && (
                <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>
            )}

            {/* Top Metrics Row */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={4} md={2}>
                    <MetricCard
                        title="Total Items"
                        value={metrics?.total_inventory_count}
                        icon={Inventory2}
                        color="#1976d2"
                    />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                    <MetricCard
                        title="Active"
                        value={metrics?.active_inventory_count}
                        icon={CheckCircle}
                        color="#4caf50"
                    />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                    <MetricCard
                        title="Packed"
                        value={metrics?.packed_count}
                        icon={Archive}
                        color="#2196f3"
                    />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                    <MetricCard
                        title="Shipped"
                        value={metrics?.shipped_count}
                        icon={LocalShipping}
                        color="#9c27b0"
                    />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                    <MetricCard
                        title="Boxes"
                        value={metrics?.box_count}
                        icon={Archive}
                        color="#ff9800"
                    />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                    <MetricCard
                        title="Pallets"
                        value={metrics?.pallet_count}
                        icon={Inventory2}
                        color="#00bcd4"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Inventory by Stage */}
                <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                            <TrendingUp sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20 }} />
                            Inventory by Stage
                        </Typography>
                        {stages.length > 0 ? (
                            <StageProgress stages={stages} />
                        ) : (
                            <Alert severity="info">No inventory data available</Alert>
                        )}
                    </Paper>
                </Grid>

                {/* Alerts */}
                <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                            <Warning sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20, color: 'warning.main' }} />
                            Alerts & Exceptions ({alerts.length})
                        </Typography>
                        {alerts.length > 0 ? (
                            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                                {alerts.map((alert, index) => (
                                    <AlertItem key={index} alert={alert} />
                                ))}
                            </List>
                        ) : (
                            <Alert severity="success">No active alerts</Alert>
                        )}
                    </Paper>
                </Grid>

                {/* Recent Events */}
                <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                            <Schedule sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20 }} />
                            Recent Events
                        </Typography>
                        {recentEvents.length > 0 ? (
                            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                                {recentEvents.map((event, index) => (
                                    <React.Fragment key={index}>
                                        <EventItem event={event} />
                                        {index < recentEvents.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                            <Alert severity="info">No recent events</Alert>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Serial Pool Stats */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6} md={3}>
                    <Card variant="outlined">
                        <CardContent sx={{ py: 1.5 }}>
                            <Typography variant="caption" color="text.secondary">Reserved Serials</Typography>
                            <Typography variant="h5" color="warning.main" fontWeight="bold">
                                {metrics?.reserved_serials?.toLocaleString() || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Card variant="outlined">
                        <CardContent sx={{ py: 1.5 }}>
                            <Typography variant="caption" color="text.secondary">Consumed Serials</Typography>
                            <Typography variant="h5" color="success.main" fontWeight="bold">
                                {metrics?.consumed_serials?.toLocaleString() || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Card variant="outlined">
                        <CardContent sx={{ py: 1.5 }}>
                            <Typography variant="caption" color="text.secondary">Pending Confirmation</Typography>
                            <Typography variant="h5" color="info.main" fontWeight="bold">
                                {metrics?.pre_inventory_count?.toLocaleString() || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Card variant="outlined">
                        <CardContent sx={{ py: 1.5 }}>
                            <Typography variant="caption" color="text.secondary">Sealed Containers</Typography>
                            <Typography variant="h5" color="primary.main" fontWeight="bold">
                                {metrics?.sealed_containers?.toLocaleString() || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
