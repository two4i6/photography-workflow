import {
  Container, useId,
} from '@chakra-ui/react';
import {CollectionCardComponents} from '../components/collectioncard';
import { useEffect, useState, useRef } from 'react';
import type { hit } from '../../lib/redis.js/redis';

  const Home = ({}) => {

    //DEBUG RENDER COUNTER
    const renderCounter = useRef(0);
    useEffect (() => {
        renderCounter.current = renderCounter.current + 1;
        console.log('index:', renderCounter);
    })

    const [hits, setHits] = useState<Array<hit>>([]);
    useEffect(() => {
      const search = async () => {
        // todo change this demo
        const res = await fetch(`/api/search?q=two4i6`);
        const result =  await res.json();
        setHits(result.imgInfo);
      }
      search();
  },[]);
  

  return (
    <CollectionCardComponents hits={hits} />
  );
};

export default Home;