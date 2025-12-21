import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Tooltip,
    useTheme
} from '@mui/material';
import { Amenity } from '../../interfaces/Amenity';

interface AmenityItemProps {
    amenity: Amenity;
    icon: React.ReactNode;
    variant?: 'simple' | 'paper';
}

const AmenityItem: React.FC<AmenityItemProps> = ({
    amenity,
    icon,
    variant = 'simple'
}) => {
    const theme = useTheme();

    if (variant === 'simple') {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {icon}
                <Typography variant="body1">
                    {amenity.name}
                </Typography>
            </Box>
        );
    }

    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                height: '100%',
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                }
            }}
        >
            <Tooltip title={amenity.name}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: theme.palette.primary.light,
                    color: 'white',
                    borderRadius: '50%',
                    p: 1,
                }}>
                    {icon}
                </Box>
            </Tooltip>
            <Typography variant="body1">
                {amenity.name}
            </Typography>
        </Paper>
    );
};

export default AmenityItem;
