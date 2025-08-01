import { useEffect, useState } from 'react';
import { Table, Button, Input } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { User, UserType } from '../../interfaces/User';
import { Popconfirm } from 'antd';
import { useLoading } from '../../contexts/LoaderContext';
import { useTranslation } from 'react-i18next';

export default function Admin_Hotel_Users() {
    const { hotelId } = useParams<{ hotelId: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { showLoader, hideLoader } = useLoading();
    const PAGE_SIZE = 10;

    useEffect(() => {
        const fetchUsersData = async (searchValue: string, pageNumber: number) => {
            showLoader();
            const params = new URLSearchParams({
                page: pageNumber.toString(),
                size: PAGE_SIZE.toString(),
                ...(searchValue ? { email: searchValue } : {})
            });

            try {
                const response = await fetch(`http://localhost:8080/api/hotels/${hotelId}/users?${params}`, {
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
                    console.log('Unauthorized/Forbidden access. Redirecting to login page...');
                    window.location.href = '/login';
                    return;
                }

                const data = await response.json();

                if (data.content) {
                    const nonAdminUsers = data.content.filter((user: User) => user.userType !== UserType.ADMIN);

                    const usersWithKeys = nonAdminUsers.map((user: User) => ({
                        ...user,
                        key: user.userId,
                    }));

                    setUsers(usersWithKeys);
                    setTotalPages(data.totalPages);
                    setPage(data.number);
                } else {
                    const nonAdminUsers = data.filter((user: User) => user.userType !== UserType.ADMIN);

                    const usersWithKeys = nonAdminUsers.map((user: User) => ({
                        ...user,
                        key: user.userId,
                    }));

                    setUsers(usersWithKeys);
                    setTotalPages(Math.ceil(usersWithKeys.length / PAGE_SIZE));
                    setPage(0);
                }
            } catch (error) {
                console.error('Error fetching users data:', error);
            }
            hideLoader();
        };

        fetchUsersData(searchQuery, page);
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

    const handleDelete = async (userId: string) => {
        showLoader();
        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
        hideLoader();
    };

    const columns = [
        {
            title: t('admin.users.columns.email', 'Email'),
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: t('admin.users.columns.firstName', 'First Name'),
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: t('admin.users.columns.lastName', 'Last Name'),
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: t('admin.users.columns.hotelName', 'Hotel Name'),
            key: 'name',
            render: (_: any, record: User) => record.hotel?.name || t('admin.users.noHotelAssigned', 'No Hotel Assigned'),
        },
        {
            title: t('admin.users.columns.position', 'Position'),
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: t('admin.users.columns.address', 'Address'),
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: t('admin.users.columns.actions', 'Actions'),
            key: 'actions',
            render: (_: any, record: User) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <Popconfirm
                        title={t('admin.users.deleteConfirmation', 'Are you sure you want to delete this user?')}
                        onConfirm={() => handleDelete(record.userId)}
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
                <h1 className="text-2xl font-bold">{t('admin.hotels.title_users', 'Hotel Users')}</h1>
            </div>

            <main className="flex-grow p-5">
                <div className="bg-white shadow-md rounded-lg p-5">
                    {/* Search bar */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder={t('admin.users.searchPlaceholder', 'Search users')}
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
                            onClick={() => navigate(`/manager/hotel/${hotelId}/staff/add`)}
                        >
                            {t('admin.users.addUser', 'Add User')}
                        </Button>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={users}
                        pagination={{
                            current: page + 1,
                            pageSize: PAGE_SIZE,
                            total: totalPages * PAGE_SIZE,
                            onChange: (page) => setPage(page - 1),
                        }}
                        onRow={(record) => ({
                            onClick: () => navigate(`/manager/hotel/${hotelId}/staff/${record.userId}`),
                        })}
                        rowClassName="cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all"
                    />
                </div>
            </main>
        </div>
    );
}