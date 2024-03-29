import { useEffect, useState, VFC } from 'react';
import useTitle from 'react-use/lib/useTitle';
import Scrambo from 'scrambo';
import SwiperCore, { Navigation, Keyboard } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'twin.macro';

SwiperCore.use([Navigation, Keyboard]);

export const ScramblePage: VFC = () => {
  useTitle('Scramble');
  const [scrambles, setScrambles] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (index + 3 >= scrambles.length) {
      const id = setTimeout(() => {
        setScrambles(scrambles.concat(new Scrambo().get(3)));
      }, 1000 / 60);
      return () => clearTimeout(id);
    }
  }, [index, scrambles]);
  return (
    <div tw="w-screen">
      <div tw="font-bold text-3xl text-center">#{index + 1}</div>
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
