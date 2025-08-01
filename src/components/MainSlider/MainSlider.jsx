import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import img5 from '../../assets/1.jpg'
import img4 from '../../assets/2.jpg'
import img3 from '../../assets/3.jpg'
import img2 from '../../assets/4.jpg'
import img1 from '../../assets/5.jpg'

export default function MainSlider() {
  const sliderImages = [img1, img2, img3]
  const rightImages = [img4, img5]

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  }

  return (
    <div className="flex items-center justify-center bg-gray-100 w-full" style={{height: '50vh', minHeight: 250}}>
      <div
        className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3 p-3 rounded-xl overflow-hidden bg-white shadow-md w-full max-w-4xl h-full min-h-0"
        style={{height: '100%'}}
      >
        <div className="h-full w-full min-h-0 overflow-hidden rounded-lg flex flex-col">
          <Slider {...settings} className="h-full w-full min-h-0">
            {sliderImages.map((img, index) => (
              <div key={index} className="h-full w-full min-h-0 flex">
                <img
                  src={img}
                  alt={`Slide ${index + 1}`}
                  className="h-full w-full min-h-0 object-cover rounded-lg"
                  style={{height: '100%', width: '100%'}}
                />
              </div>
            ))}
          </Slider>
        </div>

        <div className="h-full w-full min-h-0 flex flex-col gap-3">
          {rightImages.map((img, index) => (
            <div key={index} className="flex-1 min-h-0 w-full overflow-hidden rounded-lg flex">
              <img
                src={img}
                alt={`Static ${index + 4}`}
                className="h-full w-full min-h-0 object-cover rounded-lg"
                style={{height: '100%', width: '100%'}}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
