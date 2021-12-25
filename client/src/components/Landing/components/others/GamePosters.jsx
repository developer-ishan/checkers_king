import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const GamePosters = () => {
  return (
    <Carousel autoPlay infiniteLoop showStatus={false} showThumbs={false}>
      <div>
        <img alt="" src="/images/poster1.jpg" />
        {/* optinal */}
        {/* <p className="legend">Legend 4</p> */}
      </div>
      <div>
        <img alt="" src="/images/poster2.jpg" />
      </div>
      <div>
        <img alt="" src="/images/poster3.jpg" />
      </div>
      <div>
        <img alt="" src="/images/poster4.jpg" />
      </div>
    </Carousel>
  );
};

export default GamePosters;
