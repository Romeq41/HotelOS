import React from 'react';
import {
    Card,
    CardContent,
    Box,
    Typography,
    Button,
    Fade,
    useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Hotel } from '../../interfaces/Hotel';

interface ContactInfoProps {
    hotel: Hotel;
    showContact: boolean;
    toggleContact: () => void;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
    hotel,
    showContact,
    toggleContact
}) => {
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <>
            {/* Contact Information Toggle Button */}
            <Box sx={{ mt: 2, textAlign: 'center', position: 'relative', zIndex: 85 }}>
                <Button
                    variant="text"
                    size="small"
                    onClick={toggleContact}
                    sx={{
                        textTransform: 'none',
                        fontSize: '0.9rem',
                        color: theme.palette.text.secondary
                    }}
                >
                    {showContact ? t('hotelDetails.hideContactInfo') : t('hotelDetails.showContactInfo')}
                </Button>
            </Box>

            {/* Contact Information Card - Animated on toggle */}
            <Fade in={showContact} timeout={500}>
                <Box sx={{
                    position: 'relative',
                    mt: 1,
                    height: showContact ? 'auto' : 0,
                    overflow: showContact ? 'visible' : 'hidden',
                    transition: 'all 0.3s ease',
                    zIndex: 80
                }}>
                    <Card
                        elevation={3}
                        sx={{
                            borderRadius: 2,
                            overflow: 'hidden',
                            transform: showContact ? 'translateY(0)' : 'translateY(-20px)',
                            transition: 'transform 0.3s ease',
                            boxShadow: '0px 4px 12px rgba(0,0,0,0.08)'
                        }}
                    >
                        <Box sx={{
                            bgcolor: theme.palette.grey[100],
                            p: 2,
                            borderBottom: `1px solid ${theme.palette.divider}`
                        }}>
                            <Typography variant="h6" fontWeight="bold">
                                {t('hotelDetails.contact')}
                            </Typography>
                        </Box>
                        <CardContent>
                            <Typography variant="body2" paragraph>
                                {t('hotelDetails.contactHelpText')}
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1.5,
                                mb: 2
                            }}>
                                {(hotel.contactInformation?.phoneNumber || hotel.phoneNumber) && (
                                    <Typography variant="body2">
                                        <strong>{t('hotelDetails.phone')}:</strong> {hotel.contactInformation?.phoneNumber || hotel.phoneNumber}
                                    </Typography>
                                )}
                                {(hotel.contactInformation?.email || hotel.email) && (
                                    <Typography variant="body2">
                                        <strong>{t('hotelDetails.email')}:</strong> {hotel.contactInformation?.email || hotel.email}
                                    </Typography>
                                )}
                                {(hotel.addressInformation?.address || hotel.address) && (
                                    <Typography variant="body2">
                                        <strong>{t('hotelDetails.address')}:</strong> {hotel.addressInformation?.address || hotel.address},
                                        {' '}{hotel.addressInformation?.city || hotel.city},
                                        {hotel.addressInformation?.state && ` ${hotel.addressInformation.state},`}
                                        {hotel.addressInformation?.zipCode && ` ${hotel.addressInformation.zipCode},`}
                                        {' '}{hotel.addressInformation?.country || hotel.country}
                                    </Typography>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Fade>
        </>
    );
};

export default ContactInfo;
