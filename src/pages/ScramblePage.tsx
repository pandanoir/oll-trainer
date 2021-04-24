import { useEffect, useState } from 'react';
import SwiperCore, { Navigation, Keyboard } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Scrambo from 'scrambo';

SwiperCore.use([Navigation, Keyboard]);

export const ScramblePage = () => {
  const [scrambles, setScrambles] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (index + 3 >= scrambles.length) {
      const id = setTimeout(() => {
        setScrambles(scrambles.concat(new Scrambo().get(3)));
      }, 1000 / 60);
      return () => clearTimeout(id);
    }
  });
  return (
    <div className="w-screen">
      <div className="font-bold text-3xl text-center">#{index + 1}</div>
      <Swiper
        onSlideChange={({ activeIndex }: { activeIndex: number }) =>
          setIndex(activeIndex)
        }
        keyboard
        spaceBetween={50}
        navigation
      >
        {scrambles.map((scramble, index) => (
          <SwiperSlide key={index}>{scramble}</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
