import React from "react";
import "./NetflixIntro.css";

export default function NetflixIntro() {
  return (
    <div className="netflix-container">
      <div className="netflixintro" data-letter="N">
        {[1, 2, 3, 4].map((num) => (
          <div className={`helper-${num}`} key={num}>
            <div className="effect-brush">
              {[...Array(31)].map((_, i) => (
                <span key={i} className={`fur-${i + 1}`}></span>
              ))}
            </div>
            {num === 1 && (
              <div className="effect-lumieres">
                {[...Array(28)].map((_, i) => (
                  <span key={i} className={`lamp-${i + 1}`}></span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
