 import SliderWithBlocks from "../components/SliderWithBlocks";
 import CollectionLinks from "../components/CollectionLinks";
// import { motion } from "framer-motion"

import AnimatedTitle from "../components/AnimatedTitle";

export default function HomePage() {
  return (

    <div>
      <AnimatedTitle />


    <SliderWithBlocks />
     <CollectionLinks /> 
    <div className="h-[1000px]"></div>
    </div>
  );
}
