import { useEffect, useState } from "react";
import "./App.css";
import backgroundImage from "./assets/fotos-casamento.jpeg";

// Data do evento: 01/11/2025 às 20h horário de Brasília
const targetDate = new Date("2025-11-01T20:00:00-03:00");

export function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="layout">
      <div
        className="left"
        style={{ background: `url(${backgroundImage}) center/cover no-repeat` }}
      >
        <div className="overlay">
          <h1>Sarah & Rommel</h1>
          <p>01/11/2025</p>
        </div>
      </div>

      <div className="right">
        <p className="subtitle">
          Contando os dias para o nosso felizes para sempre...
        </p>
        <div className="countdown">
          <div>
            <span>{timeLeft.days}</span>
            <label>dias</label>
          </div>
          <div>
            <span>{timeLeft.hours}</span>
            <label>horas</label>
          </div>
          <div>
            <span>{timeLeft.minutes}</span>
            <label>minutos</label>
          </div>
          <div>
            <span>{timeLeft.seconds}</span>
            <label>segundos</label>
          </div>
        </div>

        {/* <div className="gallery">
          <img src="/foto1.jpg" alt="Casal" />
          <img src="/foto2.jpg" alt="Momentos" />
          <img src="/foto3.jpg" alt="Detalhes" />
        </div> */}

        <p className="creditinho">
          Site em construção pela irmã da noiva, em breve novidades!
        </p>
      </div>
    </div>
  );
}
