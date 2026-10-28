import React from 'react';
import { Room } from '../../types/hotel';
import { useHotel } from '../../context/HotelContext';
import {
  Users,
  Bed,
  Maximize2,
  Star,
  Eye,
  CheckCircle,
  Wifi,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface RoomCardProps {
  room: Room;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const { formatPrice, setSelectedRoomForDetails, setSelectedRoomForBooking } = useHotel();

  const isAvailable = room.status === 'Available';
  const isOccupied = room.status === 'Occupied';
  const isCleaning = room.status === 'Cleaning';
  const isMaintenance = room.status === 'Maintenance';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Thumbnail & Badges */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
        <img
          src={room.images[0]}
          alt={room.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Live Availability Badge */}
        <div className="absolute top-3 left-3">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-600 text-white shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Available for Booking
            </span>
          ) : isOccupied ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-600 text-white shadow-sm">
              Occupied
            </span>
          ) : isCleaning ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white shadow-sm">
              In Housekeeping
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-600 text-white shadow-sm">
              Under Maintenance
            </span>
          )}
        </div>

        {/* Room Number & Floor */}
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-xs font-semibold">
          Room {room.roomNumber} · Floor {room.floor}
        </div>

        {/* Rating Floating Tag */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-slate-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-md flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{room.rating.toFixed(2)}</span>
          <span className="text-slate-400 font-normal">({room.reviewCount})</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata Line (Anti-Slop rule: unboxed text with dots) */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1.5">
            <span className="text-blue-700 font-semibold">{room.type}</span>
            <span aria-hidden="true">·</span>
            <span>{room.sizeSqFt} sq ft</span>
            <span aria-hidden="true">·</span>
            <span>{room.bedType}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
            {room.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {room.description}
          </p>

          {/* Key Specs Row */}
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Up to {room.capacity.adults} Adults, {room.capacity.children} Kids</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-slate-400" />
              <span>High-speed Wi-Fi 6</span>
            </div>
          </div>

          {/* Amenities Mini List */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {room.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200/60 rounded px-2 py-0.5"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-[11px] text-slate-400 px-1 py-0.5">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Actions Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-slate-900">
                {formatPrice(room.pricePerNight)}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ night</span>
            </div>
            {room.originalPrice && (
              <div className="text-[11px] text-slate-400 line-through">
                {formatPrice(room.originalPrice)} regular
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedRoomForDetails(room)}
              className="px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Details</span>
            </button>

            <button
              onClick={() => setSelectedRoomForBooking(room)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                isAvailable
                  ? 'bg-blue-700 hover:bg-blue-800 text-white shadow-blue-200'
                  : 'bg-slate-800 hover:bg-slate-900 text-white'
              }`}
            >
              <span>{isAvailable ? 'Book Room' : 'View / Pre-book'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
