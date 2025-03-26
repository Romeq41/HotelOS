import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHotel } from '@fortawesome/free-solid-svg-icons/faHotel';

export default function AdminHeader() {
    return (
        <header className="bg-white shadow-md px-5 py-4 flex justify-between items-center" >
            <a href="/" className="flex items-center">
                <div className="logo text-4xl font-bold cursor-pointer flex items-center">
                    <FontAwesomeIcon icon={faHotel} size="xs" className="text-black p-2" />
                    <p className="text-black ">HotelOS</p>
                </div>
            </a>
            <menu className="flex items-center space-x-4">
                <a href="/admin/hotels" className="text-black hover:text-gray-300 text-2xl border-2 p-2">Hotels</a>
                <a href="/admin/users" className="text-black hover:text-gray-300 text-2xl border-2 p-2">Users</a>
            </menu>
        </header >
    );
}