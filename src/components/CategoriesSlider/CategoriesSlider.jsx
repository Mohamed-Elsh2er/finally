import React, { useEffect, useState } from 'react'
import Style from './CategoriesSlider.module.css'
import Slider from 'react-slick'
import axios from 'axios';
export default function CategoriesSlider() {
  const [categories, setCategories] = useState([]);
  async function getCategories() {
    let { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/categories')
    console.log('Categories:', data.data);
    setCategories(data.data);
  }
  useEffect(() => {
    getCategories();
  }, []);
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
  };
  return (
    <div className="my-8 min-h-[220px]">
      {categories.length > 0 && (
        <Slider {...settings} key={categories.length}>
          {categories.map((category) => (
            <div key={category._id} className={Style.categoryItem}>
              <img src={category.image} alt={category.name} className='w-100 h-[200px] object-cover' />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}
