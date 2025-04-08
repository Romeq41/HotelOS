import { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { Room } from '../interfaces/Room';
import { Popconfirm } from 'antd';
import Header from '../components/Header';
import { Hotel } from '../interfaces/Hotel';

export default function Admin_Hotel_Rooms() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [rooms, setRooms] = useState<Room[]>([]);
    const [hotel, setHotel] = useState<Hotel>();

    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/hotels/${id}`, {
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
                console.log('Hotel data:', data);

                setHotel(data);

            } catch (error) {
                console.error('Error fetching hotel data:', error);
            }
        };
        fetchHotelData();

        const fetchRoomsData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/rooms/hotel/' + id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    },
                });

                console.log(response)

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                if (response.status === 401 || response.status === 403) {
                    console.log('Unauthorized or forbidden access. Redirecting to login page...');
                    window.location.href = '/login';
                }

                const data = await response.json();
                console.log('Rooms data:', data);

                const roomsWithKeys = data.map((room: Room) => ({
                    ...room,
                    key: room.roomId,
                }));

                setRooms(roomsWithKeys);

            } catch (error) {
                console.error('Error fetching rooms data:', error);
            }
        };

        fetchRoomsData();
    }, []);

    const handleDelete = async (roomId: string) => {
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

            console.log(`Room with ID ${roomId} deleted successfully`);

            setRooms((prevRooms) => prevRooms.filter((room) => room.roomId !== roomId));
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    };

    const columns = [
        {
            title: 'Room Number',
            dataIndex: 'roomNumber',
            key: 'roomNumber',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Room) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <Popconfirm
                        title="Are you sure you want to delete this room?"
                        onConfirm={() => handleDelete(record.roomId)}
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

        console.log('Rooms:', rooms),

        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <Header isGradient={false} bg_color="white" textColor='black' />

            <div className="mt-20 rounded-lg pt-10 pb-5 float-end w-full flex justify-center gap-10 items-center">
                <h1 className="text-2xl font-bold">{hotel?.name} : Rooms</h1>

                <Button type="primary" onClick={() => navigate(`/admin/hotels/${id}/rooms/add`)}>Add Room</Button>
            </div>
            {/* Content */}
            <main className="flex-grow p-5">
                <div className="bg-white shadow-md rounded-lg p-5">
                    <Table
                        columns={columns}
                        dataSource={rooms}
                        onRow={(record) => ({
                            onClick: () => navigate(`/admin/hotels/${id}/rooms/${record.roomId}`),
                        })}
                        rowClassName="cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all"
                    />
                </div>
            </main>
        </div>
    );
};