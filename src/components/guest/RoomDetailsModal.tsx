import React, { useState } from 'react';
import { Room } from '../../types/hotel';
import { useHotel } from '../../context/HotelContext';
import {
  X,
  Star,
  Users,
  Bed,
  Layers,
  Maximize2,
  Check,
  Shield,
  Coffee,
  Wifi,
  Sparkles,
  ArrowRight,
  Clock,
  Calendar,
} from 'lucide-react';

interface RoomDetailsModalProps {
  room: Room;
  onClose: () => void;
}

export const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ room, onClose }) => {
  const { formatPrice, setSelectedRoomForBooking } = useHotel();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleBookNow = () => {
    onClose();
    setSelectedRoomForBooking(room);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
              <span>Room {room.roomNumber}</span>
              <span aria-hidden="true">·</span>
              <span>Floor {room.floor}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-normal">{room.type}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">{room.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Gallery Display */}
          <div>
            <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden bg-slate-100">
              <img
                src={room.images[activeImageIndex] || room.images[0]}
                alt={room.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1 rounded-md text-xs font-semibold">
                Photo {activeImageIndex + 1} of {room.images.length}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {room.images.length > 1 && (
              <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                {room.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? 'border-blue-600 ring-2 ring-blue-100'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Capacity</span>
              <span className="font-bold text-slate-800">
                {room.capacity.adults} Adults, {room.capacity.children} Kids
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Bed Type</span>
              <span className="font-bold text-slate-800">{room.bedType}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Room Size</span>
              <span className="font-bold text-slate-800">{room.sizeSqFt} sq ft ({Math.round(room.sizeSqFt * 0.0929)} m²)</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Guest Rating</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {room.rating.toFixed(2)} ({room.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">About This Room</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Key Features */}
          {room.features && room.features.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2.5">Signature Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {room.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complete Amenities */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2.5">Room Amenities & Inclusions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {room.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50/80 px-3 py-2 rounded-lg border border-slate-100"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* House Policies */}
          <div className="border-t border-slate-100 pt-4 text-xs text-slate-500 space-y-1.5">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Standard Check-in: 3:00 PM · Standard Check-out: 11:00 AM</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>Free cancellation up to 24 hours prior to check-in</span>
            </div>
          </div>
        </div>

        {/* Footer with Price and Book button */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Nightly Rate</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">
                {formatPrice(room.pricePerNight)}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ night + taxes</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleBookNow}
              className="px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Reserve Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
