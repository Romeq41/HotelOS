import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Hotel } from '../../../interfaces/Hotel';
import { useLoading } from '../../../contexts/LoaderContext';
import { useTranslation } from 'react-i18next';

export default function Hotels() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { showLoader, hideLoader } = useLoading();
    const PAGE_SIZE = 10;

    useEffect(() => {
        const fetchHotelsData = async (searchValue: string, pageNumber: number) => {
            showLoader();
            const params = new URLSearchParams({
                page: pageNumber.toString(),
                size: PAGE_SIZE.toString(),
                ...(searchValue ? { name: searchValue } : {})
            });

            try {
                const response = await fetch(`http://localhost:8080/api/hotels?${params}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                if (response.status === 401) {
                    console.log('Unauthorized access. Redirecting to login page...');
                    window.location.href = '/login';
                }
                if (response.status === 403) {
                    console.log('Forbidden access. Redirecting to login page...');
                    window.location.href = '/login';
                }

                const data = await response.json();

                if (data.content) {
                    const hotelsWithKeys = data.content.map((hotel: Hotel) => ({
                        ...hotel,
                        key: hotel.id,
                    }));

                    setHotels(hotelsWithKeys);
                    setTotalPages(data.totalPages);
                    setPage(data.number);
                } else {
                    const hotelsWithKeys = data.map((hotel: Hotel) => ({
                        ...hotel,
                        key: hotel.id,
                    }));

                    setHotels(hotelsWithKeys);
                    setTotalPages(Math.ceil(data.length / PAGE_SIZE));
                    setPage(0);
                }
            } catch (error) {
                console.error('Error fetching hotels data:', error);
            }
            hideLoader();
        };

        fetchHotelsData(searchQuery, page);
    }, [searchQuery, page]);

    const handleSearch = () => {
        setPage(0);
        setSearchQuery(inputValue);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleDelete = async (hotelID: number) => {
        showLoader();
        try {
            const response = await fetch(`http://localhost:8080/api/hotels/${hotelID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete hotel');
            }

            console.log(`Hotel with ID ${hotelID} deleted successfully`);

            setHotels((prevHotels) => prevHotels.filter((hotel) => hotel.id !== hotelID));
        } catch (error) {
            console.error('Error deleting hotel:', error);
        }
        hideLoader();
    };

    const columns = [
        {
            title: t('admin.hotels.columns.id', 'ID'),
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: t('admin.hotels.columns.name', 'Hotel Name'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('admin.hotels.columns.city', 'City'),
            dataIndex: 'city',
            key: 'city',
        },
        {
            title: t('admin.hotels.columns.state', 'State'),
            dataIndex: 'state',
            key: 'state',
        },
        {
            title: t('admin.hotels.columns.address', 'Address'),
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: t('admin.hotels.columns.country', 'Country'),
            dataIndex: 'country',
            key: 'country',
        },
        {
            title: t('admin.hotels.columns.zipCode', 'Zip Code'),
            dataIndex: 'zipCode',
            key: 'zipCode',
        },
        {
            title: t('admin.hotels.columns.actions', 'Actions'),
            key: 'actions',
            render: (_: any, record: Hotel) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <Popconfirm
                        title={t('admin.hotels.deleteConfirmation', 'Are you sure you want to delete this hotel?')}
                        onConfirm={() => handleDelete(record.id)}
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
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="mt-20 rounded-lg pt-10 pb-5 float-end w-full flex justify-center gap-10 items-center">
                <h1 className="text-2xl font-bold">{t('admin.hotels.title', 'Hotels')}</h1>
            </div>

            <main className="flex-grow p-5">
                <div className="bg-white shadow-md rounded-lg p-5">
                    {/* Search (left) & Add Hotel (right) */}
                    <div className="flex items-center justify-between mb-4">
                        {/* Left side: Input + Search button */}
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder={t('admin.hotels.searchPlaceholder', 'Search hotels')}
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
                            onClick={() => navigate('/admin/hotels/add')}
                        >
                            {t('admin.hotels.addHotel', 'Add Hotel')}
                        </Button>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={hotels}
                        pagination={{
                            current: page + 1,
                            pageSize: PAGE_SIZE,
                            total: totalPages * PAGE_SIZE,
                            onChange: (page) => setPage(page - 1),
                        }}
                        onRow={(record) => ({
                            onClick: () => navigate(`/admin/hotels/${record.id}`),
                        })}
                        rowClassName="cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all"
                    />
                </div>
            </main>
        </div>
    );
}