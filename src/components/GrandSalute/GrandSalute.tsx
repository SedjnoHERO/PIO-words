import { useEffect, useState } from 'react';
import { Confetti } from '../Confetti/Confetti';
import { FireworksBurst } from '../FireworksBurst/FireworksBurst';
import { FloatingHearts } from '../FloatingHearts/FloatingHearts';

export const GrandSalute = () => {
  const [wave, setWave] = useState(0);

  useEffect(() => {
    setWave(1);

    const waveTwo = window.setTimeout(() => setWave(2), 700);
    const waveThree = window.setTimeout(() => setWave(3), 1400);

    return () => {
      window.clearTimeout(waveTwo);
      window.clearTimeout(waveThree);
    };
  }, []);

  return (
    <>
      <Confetti count={110} />
      <FloatingHearts count={28} />
      {wave >= 1 ? <FireworksBurst burstId={wave} intensity="grand" /> : null}
      {wave >= 2 ? <FireworksBurst burstId={wave + 10} intensity="grand" /> : null}
      {wave >= 3 ? <FireworksBurst burstId={wave + 20} intensity="grand" /> : null}
    </>
  );
};
