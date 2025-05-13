import { useEffect, useState } from 'react';
import { Table, Button, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { User, UserType } from '../../../interfaces/User';
import { Popconfirm } from 'antd';
import { useLoading } from '../../../contexts/LoaderContext';

export default function Users() {
    const navigate = useNavigate();

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
                const response = await fetch(`http://localhost:8080/api/users?${params}`, {
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
                console.log('Users data:', data);

                const nonAdminUsers = data.content.filter((user: User) => user.userType !== UserType.ADMIN);

                const usersWithKeys = nonAdminUsers.map((user: User) => ({
                    ...user,
                    key: user.userId,
                }));

                setUsers(usersWithKeys);
                setTotalPages(data.totalPages);
                setPage(data.number);
            } catch (error) {
                console.error('Error fetching users data:', error);
            }
            hideLoader();
        };


        fetchUsersData(searchQuery, page);
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

            console.log(`User with ID ${userId} deleted successfully`);

            setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
        hideLoader();
    };


    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Name',
            key: 'name',
            render: (_: any, record: User) => record.hotel?.name || 'No Hotel Assigned',
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: User) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <Popconfirm
                        title="Are you sure you want to delete this user?"
                        onConfirm={() => handleDelete(record.userId)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="primary"
                            danger
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Title & Add User */}
            <div className="mt-20 rounded-lg pt-10 pb-5 float-end w-full flex justify-center gap-10 items-center">
                <h1 className="text-2xl font-bold">Users</h1>
            </div>

            {/* Content */}
            <main className="flex-grow p-5">
                <div className="bg-white shadow-md rounded-lg p-5">
                    {/* Search bar */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Search users"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                style={{ width: 200 }}
                            />
                            <Button type="default" onClick={handleSearch}>
                                Search
                            </Button>
                        </div>
                        <Button type="primary" href="/admin/users/add">Add User</Button>
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
                            onClick: () => navigate(`/admin/users/${record.userId}`),
                        })}
                        rowClassName="cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all"
                    />
                </div>
            </main>
        </div>
    );
}