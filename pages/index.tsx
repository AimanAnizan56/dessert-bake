import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { Box, Heading, keyframes, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { ironSessionOptions } from '../lib/helper';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import Link from 'next/link';
import Head from 'next/head';

const thumbnail_image = process.env.NEXT_PUBLIC_THUMBNAIL;

export default function Home(props: any) {
  const bounceKayframes = keyframes`
  0% { transform: translateY(5px) }
  25% { transform: translateY(-5px) }
  50% { transform: translateY(5px) }
  75% { transform: translateY(-5px) }
  100% { transform: translateY(5px) }
`;

  const bounceAnimation = `${bounceKayframes} 2s ease-in-out infinite`;

  return (
    <>
      <Head>
        <meta property="og:image" content={thumbnail_image} />
      </Head>
      {props.user.id ? (
        <Navbar
          pageTitle="Homepage"
          pageDescription="Indulge your sweet tooth with our delectable selection of desserts. Our online bakery offers a wide variety of cakes, desserts, and baverages that are perfect for any occasion. Order from our online bakery and enjoy fast services."
          currentPage={'Home'}
          user={props.user}
        />
      ) : (
        <Navbar
          pageTitle="Homepage"
          pageDescription="Indulge your sweet tooth with our delectable selection of desserts. Our online bakery offers a wide variety of cakes, desserts, and baverages that are perfect for any occasion. Order from our online bakery and enjoy fast services."
          currentPage={'Home'}
        />
      )}
      <main>
        <Swiper pagination={{ dynamicBullets: true }} modules={[Pagination]} style={{ background: 'gray' }}>
          <SwiperSlide>
            <Box as="div" position={'relative'} cursor={'default'}>
              <Box as="div" w={'100vw'} h={'80vh'}>
                <Image src={'/img/carousel-1.jpg'} style={{ filter: 'blur(2px)' }} fill alt={'caraousel image 1'} />
              </Box>

              <Box as="span" textShadow={'1px 1px 1px rgb(0,0,0)'} color={'white'} position={'absolute'} top={'50%'} right={'50%'} transform={'translate(50%,-50%)'}>
                <Text fontSize={'2xl'} color={'brand.500'} fontWeight={'600'}>
                  Fresh & Delicious
                </Text>

                <Heading textAlign={'center'} as="h1">
                  Welcome to Dessert Bake
                </Heading>

                <Text textAlign={'center'}>Premium Quality & Tasty Products</Text>

                <Box as={motion.div} animation={bounceAnimation} bg={'brand.500'} mx={'auto'} mt={'0.8rem'} display={'flex'} alignItems={'center'} justifyContent={'center'} gap={'0.5rem'} w={'10rem'} py={'0.5rem'} px={'0.2rem'} borderRadius={30}>
                  <Link href="/products">Shop Now</Link>
                </Box>
              </Box>
            </Box>
          </SwiperSlide>
        </Swiper>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(async ({ req }) => {
  if (req.session.user) {
    if (req.session.user.admin) {
      return {
        redirect: {
          destination: '/admin/',
          permanent: false,
        },
      };
    }
  }

  return {
    props: {
      user: req.session.user ? req.session.user : {},
    },
  };
}, ironSessionOptions);
