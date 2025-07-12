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
    <div className="flex items-center justify-center bg-gray-100 w-[75vh] h-[50vh] m-auto">
      <div
        className="grid grid-cols-[2fr_1fr] gap-3 p-3 rounded-xl overflow-hidden bg-white shadow-md"
        style={{ height: '50vh', width: '75vh' }}
      >
        <div className="h-full w-full overflow-hidden rounded-lg">
          <Slider {...settings}>
            {sliderImages.map((img, index) => (
              <div key={index}>
                <img
                  src={img}
                  alt={`Slide ${index + 1}`}
                  className="h-full w-full object-cover rounded-lg"
                  style={{ height: '50vh', width: '100%' }}
                />
              </div>
            ))}
          </Slider>
        </div>

        <div className="h-full w-full flex flex-col gap-3">
          {rightImages.map((img, index) => (
            <div key={index} className="h-1/2 w-full overflow-hidden rounded-lg">
              <img
                src={img}
                alt={`Static ${index + 4}`}
                className="h-full w-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
