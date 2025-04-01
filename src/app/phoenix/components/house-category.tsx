import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type HouseCardProps = {
  title: string;
  location: string;
  price: string;
  imageUrl: string;
};

const HouseCard = ({ title, location, price, imageUrl }: HouseCardProps) => {
  return (
    <div className="relative rounded-xl overflow-hidden">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-56 object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm">{location}</p>
      </div>
      <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-md text-sm font-semibold">
        {price}
      </div>
    </div>
  );
};

export default function HouseCategory() {
  const houses = [
    {
      id: 1,
      title: 'Luxury White',
      location: 'NTB, Indonesia',
      price: '$11,750.00',
      imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80'
    },
    {
      id: 2,
      title: 'Wooden Jungle',
      location: 'NTT, Indonesia',
      price: '$12,510.00',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
    },
    {
      id: 3,
      title: 'Next Future',
      location: 'Bali, Indonesia',
      price: '$13,750.00',
      imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">House Category</h2>
        <div className="flex gap-2">
          <button className="p-1 rounded-md bg-gray-100 text-gray-600">
            <ChevronLeft size={20} />
          </button>
          <button className="p-1 rounded-md bg-blue-600 text-white">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {houses.map((house) => (
          <HouseCard
            key={house.id}
            title={house.title}
            location={house.location}
            price={house.price}
            imageUrl={house.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
