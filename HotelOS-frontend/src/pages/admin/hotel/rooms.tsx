import { useEffect, useState } from 'react';
import { Table, Button, Input } from 'antd';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Room } from '../../../interfaces/Room';
import { Popconfirm } from 'antd';
import { Hotel } from '../../../interfaces/Hotel';
import { useLoading } from '../../../contexts/LoaderContext';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../../contexts/UserContext';
import { UserType } from '../../../interfaces/User';

export default function Admin_Hotel_Rooms() {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const { user: currentUser } = useUser();

    const [rooms, setRooms] = useState<Room[]>([]);
    const [hotel, setHotel] = useState<Hotel>();
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { showLoader, hideLoader } = useLoading();
    const PAGE_SIZE = 10;

    // Helper function to determine the correct base path for navigation
    const getBasePath = () => {
        const path = location.pathname;
        if (path.includes('/admin/')) {
            return `/admin/hotels/${hotelId}`;
        } else if (path.includes('/manager/')) {
            return `/manager/hotel/${hotelId}`;
        }
        // Default fallback based on user role
        return currentUser?.userType === UserType.ADMIN
            ? `/admin/hotels/${hotelId}`
            : `/manager/hotel/${hotelId}`;
    };

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
        const fetchRoomsData = async (searchValue: string, pageNumber: number) => {
            showLoader();
            const params = new URLSearchParams({
                page: pageNumber.toString(),
                size: PAGE_SIZE.toString(),
                ...(searchValue ? { roomNumber: searchValue } : {})
            });

            try {
                const response = await fetch(`http://localhost:8080/api/hotels/${hotelId}/rooms?${params}`, {
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
                    return;
                }

                const data = await response.json();

                if (data.content) {
                    const roomsWithKeys = data.content.map((room: Room) => ({
                        ...room,
                        key: room.roomId,
                    }));

                    setRooms(roomsWithKeys);
                    setTotalPages(data.totalPages);
                    setPage(data.number);
                } else {
                    const roomsWithKeys = data.map((room: Room) => ({
                        ...room,
                        key: room.roomId,
                    }));

                    setRooms(roomsWithKeys);
                    setTotalPages(Math.ceil(roomsWithKeys.length / PAGE_SIZE));
                    setPage(0);
                }
            } catch (error) {
                console.error('Error fetching rooms data:', error);
            }
            hideLoader();
        };

        fetchRoomsData(searchQuery, page);
    }, [hotelId, searchQuery, page]);

    const handleSearch = () => {
        setPage(0);
        setSearchQuery(inputValue);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleDelete = async (roomId: string) => {
        showLoader();
        try {
            const response = await fetch(`http://localhost:8080/api/rooms/${roomId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete room');
            }

            setRooms((prevRooms) => prevRooms.filter((room) => room.roomId !== roomId));
        } catch (error) {
            console.error('Error deleting room:', error);
        }
        hideLoader();
    };

    const columns = [
        {
            title: t('admin.hotels.rooms.columns.roomNumber', 'Room Number'),
            dataIndex: 'roomNumber',
            key: 'roomNumber',
        },
        {
            title: t('admin.hotels.rooms.columns.type', 'Type'),
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: t('admin.hotels.rooms.columns.rate', 'Rate'),
            dataIndex: 'rate',
            key: 'rate',
            render: (rate: number) => `$${rate.toFixed(2)}`,
        },
        {
            title: t('admin.hotels.rooms.columns.status', 'Status'),
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: t('admin.hotels.columns.actions', 'Actions'),
            key: 'actions',
            render: (_: any, record: Room) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <Popconfirm
                        title={t('admin.hotels.rooms.deleteConfirmation', 'Are you sure you want to delete this room?')}
                        onConfirm={() => handleDelete(record.roomId)}
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
            <div className="mt-20 rounded-lg pt-10 pb-5 float-end w-full flex justify-center gap-10 items-center">
                <h1 className="text-2xl font-bold">
                    {hotel?.name} : {t('hotel.rooms', 'Rooms')}
                </h1>
            </div>

            {/* Content */}
            <main className="flex-grow p-5">
                <div className="bg-white shadow-md rounded-lg p-5">
                    {/* Search bar and Add Room button */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder={t('admin.hotels.rooms.searchPlaceholder', 'Search rooms')}
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
                            onClick={() => navigate(`${getBasePath()}/rooms/add`)}
                        >
                            {t('admin.hotels.rooms.addRoom', 'Add Room')}
                        </Button>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={rooms}
                        pagination={{
                            current: page + 1,
                            pageSize: PAGE_SIZE,
                            total: totalPages * PAGE_SIZE,
                            onChange: (page) => setPage(page - 1),
                        }}
                        onRow={(record) => ({
                            onClick: () => navigate(`${getBasePath()}/rooms/${record.roomId}`),
                        })}
                        rowClassName="cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all"
                    />
                </div>
            </main>
        </div>
    );
}