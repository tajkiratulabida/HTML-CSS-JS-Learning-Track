import React from 'react'
import Hero from '../components/Hero'
import LatestCollectiion from '../components/LatestCollectiion'
import BestSeller from '../components/BestSeller'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollectiion/>
      <BestSeller />
    </div>
  )
}

export default Home