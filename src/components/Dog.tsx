import { Heart } from "lucide-react";
import { cn } from "../utils/utils";
import { DogProps } from "../global.d";

const Dog = ({ dog, isFavorite, onToggleFavorite }: DogProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="aspect-square relative">
        <img
          src={dog.img}
          alt={dog.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => onToggleFavorite(dog.id)}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors",
              isFavorite ? "fill-primary-600 text-primary-600" : "text-gray-500"
            )}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900">{dog.name}</h3>
        <p className="text-gray-600">{dog.breed}</p>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
          <span>{dog.age} years old</span>
          <span>{dog.zip_code}</span>
        </div>
      </div>
    </div>
  );
};

Dog.displayName = "DogCard";

export default Dog;
