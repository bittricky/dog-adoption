import { Heart, MapPin, Calendar } from "lucide-react";
import { MatchedDogProps } from "../global.d";
import { Button } from "./index";

const MatchedDog = ({ dog, onClose }: MatchedDogProps) => {
  return (
    <div className="flex flex-col">
      <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
        <img
          src={dog.img}
          alt={dog.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h3 className="text-2xl font-bold">{dog.name}</h3>
          <p className="text-white/80">{dog.breed}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center text-gray-700">
          <Calendar className="w-5 h-5 mr-2 text-primary-500" />
          <span>
            <span className="font-medium">{dog.age}</span> years old
          </span>
        </div>
        <div className="flex items-center text-gray-700">
          <MapPin className="w-5 h-5 mr-2 text-primary-500" />
          <span>{dog.zip_code}</span>
        </div>
      </div>

      <div className="bg-primary-50 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-2">
          <Heart className="w-5 h-5 mr-2 text-primary-600 fill-primary-600" />
          <h4 className="font-semibold text-primary-700">Woof!</h4>
        </div>
        <p className="text-primary-700">
          Looks like you've caught the attention of {dog.name}.
        </p>
        <br />
        <p className="text-primary-700">
          This {dog.breed} is {dog.age} years old and would love to meet you!
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Button size="lg" className="w-full">
          Contact Shelter
        </Button>
        <Button
          variant="outline"
          onClick={onClose}
          size="lg"
          className="w-full"
        >
          Continue Browsing
        </Button>
      </div>
    </div>
  );
};

export default MatchedDog;
