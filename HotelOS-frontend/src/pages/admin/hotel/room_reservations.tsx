import { useEffect, useState } from 'react';
import { Table, Button, Input, Popconfirm } from 'antd';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Reservation } from '../../../interfaces/Reservation';
import { Hotel } from '../../../interfaces/Hotel';
import { useLoading } from '../../../contexts/LoaderContext';
import { useTranslation } from 'react-i18next';
import { getBaseUrl, getPermissionContext } from '../../../utils/routeUtils';

export default function Admin_Hotel_Room_Reservations() {
    const { hotelId } = useParams<{ hotelId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [hotel, setHotel] = useState<Hotel>();
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { showLoader, hideLoader } = useLoading();
    const PAGE_SIZE = 10;

    const permissionContext = getPermissionContext(location.pathname);

    useEffect(() => {
        const fetchHotelData = async () => {
            showLoader();
            try {
                const response = await fetch(`http://localhost:8080/api/hotels/${hotelId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                if (response.status === 401 || response.status === 403) {
                    console.log('Unauthorized or forbidden access. Redirecting to login page...');
                    window.location.href = '/login';
                }

                const data = await response.json();
                setHotel(data);
            } catch (error) {
                console.error('Error fetching hotel data:', error);
            }
            hideLoader();
        };

        fetchHotelData();
    }, [hotelId]);

    useEffect(() => {
        const fetchReservationsData = async () => {
            showLoader();

            const params = new URLSearchParams({
                page: page.toString(),
                size: PAGE_SIZE.toString(),
                ...(searchQuery ? { reservationName: searchQuery } : {})
            });

            try {
                const response = await fetch(`http://localhost:8080/api/reservations/hotel/${hotelId}?${params}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                if (response.status === 401 || response.status === 403) {
                    window.location.href = '/login';
                    return;
                }

                const data = await response.json();
                if (data.content) {
                    const reservationsWithKeys = data.content.map((reservation: Reservation) => ({
                        ...reservation,
                        key: reservation.reservationId,
                    }));

                    setReservations(reservationsWithKeys);
                    setTotalPages(data.totalPages);
                    setPage(data.number);
                } else {
                    const reservationsWithKeys = data.map((reservation: Reservation) => ({
                        ...reservation,
                        key: reservation.reservationId,
                    }));

                    setReservations(reservationsWithKeys);
                    setTotalPages(Math.ceil(reservationsWithKeys.length / PAGE_SIZE));
                    setPage(0);
                }
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
            hideLoader();
        };

        fetchReservationsData();
    }, [hotelId, page, searchQuery]);

    const handleSearch = () => {
        setPage(0);
        setSearchQuery(inputValue);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleDelete = async (reservationId: number) => {
        showLoader();
        try {
            const response = await fetch(`http://localhost:8080/api/reservations/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete reservation');
            }

            setReservations(prev => prev.filter(r => r.reservationId !== reservationId));
        } catch (error) {
            console.error('Error deleting reservation:', error);
        }
        hideLoader();
    };

    const columns = [
        {
            title: t('admin.reservations.columns.id', 'ID'),
            dataIndex: 'reservationId',
            key: 'reservationId',
        },
        {
            title: t('admin.reservations.columns.room', 'Room'),
            dataIndex: ['room', 'roomNumber'],
            key: 'roomNumber',
            render: (_: any, record: Reservation) => record.room?.roomNumber || t('admin.reservations.noRoom', 'No Room'),
        },
        {
            title: t('admin.reservations.columns.guest', 'Guest'),
            dataIndex: ['guest', 'email'],
            key: 'guestEmail',
            render: (_: any, record: Reservation) => record.guest?.email || t('admin.reservations.noGuest', 'No Guest'),
        },
        {
            title: t('admin.reservations.columns.reservationName', 'Reservation Name'),
            dataIndex: 'reservationName',
            key: 'reservationName',
            render: (reservationName: string | null) => reservationName || t('admin.reservations.noName', 'Unnamed Reservation'),
        },
        {
            title: t('admin.reservations.columns.checkIn', 'Check In'),
            dataIndex: 'checkInDate',
            key: 'checkInDate',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: t('admin.reservations.columns.checkOut', 'Check Out'),
            dataIndex: 'checkOutDate',
            key: 'checkOutDate',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: t('admin.reservations.columns.status_text', 'Status'),
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const statusMap: { [key: string]: string } = {
                    CONFIRMED: t('admin.reservations.columns.status.confirmed', 'Confirmed'),
                    PENDING: t('admin.reservations.columns.status.pending', 'Pending'),
                    CHECKED_IN: t('admin.reservations.columns.status.checked_in', 'Checked In'),
                    CHECKED_OUT: t('admin.reservations.columns.status.checked_out', 'Checked Out'),
                    CANCELLED: t('admin.reservations.columns.status.cancelled', 'Cancelled'),
                };
                return statusMap[status] || status;
            },
        },
        {
            title: t('admin.reservations.columns.total', 'Total'),
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: number) => `$${amount.toFixed(2)}`,
        },
        {
            title: t('admin.reservations.columns.actions', 'Actions'),
            key: 'actions',
            render: (_: any, record: Reservation) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <Popconfirm
                        title={t('admin.reservations.deleteConfirmation', 'Are you sure you want to delete this reservation?')}
                        onConfirm={() => handleDelete(record.reservationId)}
                        okText={t('common.yes', 'Yes')}
                        cancelText={t('common.no', 'No')}
                    >
                        <Button
                            type="primary"
                            danger
                        >
                            {t('common.delete', 'Delete')}
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="mt-20 rounded-lg pt-10 pb-5 w-full flex justify-between gap-10 items-center px-5">
                <h1 className="text-2xl font-bold">
                    {hotel?.name} : {t('admin.reservations.title', 'Reservations')}
                </h1>
                <div className="text-sm text-gray-500">{t('common.total', 'Total')}: {totalPages * PAGE_SIZE}</div>
            </div>

            <main className="flex-grow p-5">
                <div className="bg-white shadow-md rounded-lg p-5">
                    {/* Search bar and Add Reservation button */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder={t('admin.reservations.searchPlaceholder', 'Search reservations')}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                style={{ width: 200 }}
                            />
                            <Button type="default" onClick={handleSearch}>
                                {t('common.search', 'Search')}
                            </Button>
                        </div>
                        <Button
                            type="primary"
                            onClick={() => navigate(`${getBaseUrl(permissionContext, hotelId || '')}/reservations/add`)}
                        >
                            {t('admin.reservations.addReservation', 'Add Reservation')}
                        </Button>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={reservations}
                        pagination={{
                            current: page + 1,
                            pageSize: PAGE_SIZE,
                            total: totalPages * PAGE_SIZE,
                            onChange: (page) => setPage(page - 1),
                        }}
                        bordered
                        size="middle"
                        onRow={(record) => ({
                            onClick: () => navigate(`${getBaseUrl(permissionContext, hotelId || '')}/reservations/${record.reservationId}`),
                        })}
                        rowClassName="cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all"
                    />
                </div>
            </main>
        </div>
    );
}