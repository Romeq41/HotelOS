import { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { Popconfirm } from 'antd';
import Header from '../components/Header';
import { Reservation } from '../interfaces/Reservation';

export default function Admin_Hotel_Room_Reservations() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState<Reservation[]>([]);

    useEffect(() => {
        const fetchReservationsData = async () => {

            console.log(`Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`)
            try {
                const response = await fetch(`http://localhost:8080/api/reservations/hotel/${id}`, {
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
                }

                const data = await response.json();
                setReservations(data);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };
        fetchReservationsData();
    }, [id]);

    const handleDelete = async (reservationId: number) => {
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
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'reservationId',
            key: 'reservationId',
        },
        {
            title: 'Room',
            dataIndex: ['room', 'roomNumber'],
            key: 'roomNumber',
            render: (_: any, record: Reservation) => record.room?.roomNumber || 'No Room',
        },
        {
            title: 'Guest',
            dataIndex: ['guest', 'email'],
            key: 'guestEmail',
            render: (_: any, record: Reservation) => record.guest?.email || 'No Guest',
        },
        {
            title: 'reservationName',
            dataIndex: 'reservationName',
            key: 'reservationName',
        },
        {
            title: 'Check In',
            dataIndex: 'checkInDate',
            key: 'checkInDate',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Check Out',
            dataIndex: 'checkOutDate',
            key: 'checkOutDate',
            render: (date: string) => new Date(date).toLocaleDateString(),

        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Total',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Reservation) => (
                <div onClick={(e) => e.stopPropagation() /* Prevent row click when interacting with Popconfirm */}>
                    <Popconfirm
                        title="Are you sure you want to delete this reservation?"
                        onConfirm={() => handleDelete(record.reservationId)}
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
            <Header isGradient={false} bg_color="white" textColor="black" />
            <div className="mt-20 rounded-lg pt-10 pb-5 w-full flex justify-center gap-10 items-center">
                <h1 className="text-2xl font-bold">Reservations</h1>

                <Button type="primary" href={`/admin/hotels/${id}/reservations/add`}>Add Reservation</Button>
            </div>

            <main className="flex-grow p-5">
                <div className="bg-white shadow-md rounded-lg p-5">
                    <Table
                        columns={columns}
                        dataSource={reservations}
                        rowKey="reservationId"
                        onRow={(record) => ({
                            onClick: () => navigate(`/admin/hotels/${id}/reservations/${record.reservationId}`),
                        })}
                        rowClassName="cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all"
                    />
                </div>
            </main>
        </div >
    );
}