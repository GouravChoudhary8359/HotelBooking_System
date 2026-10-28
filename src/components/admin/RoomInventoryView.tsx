import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Room, RoomStatus, RoomType } from '../../types/hotel';
import {
  BedDouble,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Users,
  Eye,
  Edit,
  DollarSign,
  X,
  Search,
} from 'lucide-react';

export const RoomInventoryView: React.FC = () => {
  const { rooms, updateRoomStatus, addNewRoom, formatPrice } = useHotel();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [floorFilter, setFloorFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Room Form state
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<RoomType>('Standard Deluxe');
  const [newPrice, setNewPrice] = useState(180);
  const [newFloor, setNewFloor] = useState(2);
  const [newBedType, setNewBedType] = useState('King Bed');
  const [newSize, setNewSize] = useState(480);
  const [newAdults, setNewAdults] = useState(2);
  const [newChildren, setNewChildren] = useState(1);
  const [newDescription, setNewDescription] = useState(
    'Contemporary guest room with premium bedding, modern workstation, and garden or city views.'
  );

  const filteredRooms = rooms.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (floorFilter !== 'ALL' && r.floor.toString() !== floorFilter) return false;
    return true;
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber.trim() || !newTitle.trim()) {
      alert('Please provide room number and title');
      return;
    }
    addNewRoom({
      roomNumber: newRoomNumber.trim(),
      title: newTitle.trim(),
      type: newType,
      pricePerNight: Number(newPrice),
      capacity: { adults: Number(newAdults), children: Number(newChildren) },
      bedType: newBedType,
      floor: Number(newFloor),
      sizeSqFt: Number(newSize),
      description: newDescription,
      images: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: ['High-Speed Wi-Fi', 'Smart 4K TV', 'Mini Bar', 'Marble Bath', '24/7 Room Service'],
      status: 'Available',
      features: ['Modern Decor', 'Soundproof Windows', 'In-room Safe'],
    });

    setShowAddModal(false);
    setNewRoomNumber('');
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BedDouble className="w-6 h-6 text-blue-700" />
            <span>Room Inventory & Status Rack</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time visual room rack across floors. Update housekeeping states, toggle maintenance, and configure inventory.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px] mr-1">
            Status:
          </span>
          {['ALL', 'Available', 'Occupied', 'Cleaning', 'Maintenance'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
            Floor:
          </span>
          {['ALL', '1', '2', '3', '4'].map((fl) => (
            <button
              key={fl}
              onClick={() => setFloorFilter(fl)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                floorFilter === fl
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {fl === 'ALL' ? 'All Floors' : `Floor ${fl}`}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredRooms.map((room) => {
          const isAvail = room.status === 'Available';
          const isOcc = room.status === 'Occupied';
          const isClean = room.status === 'Cleaning';
          const isMaint = room.status === 'Maintenance';

          return (
            <div
              key={room.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Top Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                      {room.roomNumber}
                    </span>
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Floor {room.floor}</div>
                      <div className="text-xs font-bold text-slate-800 line-clamp-1">{room.type}</div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      isAvail
                        ? 'bg-emerald-100 text-emerald-800'
                        : isOcc
                        ? 'bg-amber-100 text-amber-800'
                        : isClean
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {room.status}
                  </span>
                </div>

                {/* Thumbnail & Occupant info */}
                <div className="mt-3 relative h-28 rounded-lg overflow-hidden bg-slate-100">
                  <img src={room.images[0]} alt={room.title} className="w-full h-full object-cover" />
                  {room.currentGuest && (
                    <div className="absolute inset-x-0 bottom-0 bg-slate-900/85 backdrop-blur-xs text-white p-2 text-[11px]">
                      <div className="font-semibold truncate">{room.currentGuest.name}</div>
                      <div className="text-[10px] text-slate-300">
                        Until {room.currentGuest.checkOut}
                      </div>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <div className="font-bold text-slate-900 truncate">{room.title}</div>
                  <div className="text-[11px] text-slate-500">
                    {room.bedType} · {room.sizeSqFt} sq ft
                  </div>
                  <div className="text-xs font-semibold text-slate-900">
                    {formatPrice(room.pricePerNight)} <span className="text-slate-400 font-normal">/ night</span>
                  </div>
                </div>
              </div>

              {/* Quick Status Control Dropdown */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Change Status:
                </label>
                <select
                  value={room.status}
                  onChange={(e) => updateRoomStatus(room.id, e.target.value as RoomStatus)}
                  className="w-full text-xs font-medium border border-slate-200 rounded-lg p-1.5 bg-slate-50 focus:bg-white focus:outline-none cursor-pointer"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Add New Hotel Room</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 501"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Floor *</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newFloor}
                    onChange={(e) => setNewFloor(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Room Display Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Sapphire Bay Suite"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as RoomType)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white"
                  >
                    <option value="Standard Deluxe">Standard Deluxe</option>
                    <option value="Ocean View Suite">Ocean View Suite</option>
                    <option value="Executive Penthouse">Executive Penthouse</option>
                    <option value="Presidential Villa">Presidential Villa</option>
                    <option value="Family Garden Suite">Family Garden Suite</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Base Price / Night ($)</label>
                  <input
                    type="number"
                    min={50}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bed Type</label>
                  <input
                    type="text"
                    value={newBedType}
                    onChange={(e) => setNewBedType(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Adults</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={newAdults}
                    onChange={(e) => setNewAdults(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Size (sq ft)</label>
                  <input
                    type="number"
                    value={newSize}
                    onChange={(e) => setNewSize(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
