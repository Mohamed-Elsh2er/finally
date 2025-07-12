import React from 'react';
import DisplayProductss from '../DisplayProductss/DisplayProductss';
import CategoriesSlider from '../CategoriesSlider/CategoriesSlider';
import MainSlider from '../MainSlider/MainSlider';

export default function Home() {
  return (
    <div>
      <MainSlider />
      <CategoriesSlider/>
      <DisplayProductss />
    </div>
  );
}
