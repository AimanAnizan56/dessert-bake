import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, Text, Grid, Img, Button } from '@chakra-ui/react';
import { UserIcon, ShoppingBagIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/router';

type UserType = {
  id?: number;
  name?: string;
  email?: string;
};

const Navbar = ({ pageTitle, pageDescription, user }: { pageTitle: string; pageDescription: string; user?: UserType }) => {
  const router = useRouter();

  const Icons: { href: string; icon: JSX.Element; fc: Function }[] = [
    {
      href: '/customer',
      icon: <UserIcon />,
      fc: () => {},
    },
    {
      href: '/cart',
      icon: <ShoppingBagIcon />,
      fc: () => {},
    },
    {
      href: '#',
      icon: <ArrowLeftOnRectangleIcon />,
      fc: async (e: any) => {
        // logout
        e.preventDefault();

        try {
          let res = await axios.get('/api/v1/customer/logout');
          const { logout, message } = await res.data;

          if (logout) {
            if (router.pathname == '/') {
              router.reload();
              return;
            }
            router.push('/');
          }
        } catch (err) {
          console.log('err', err);
        }
      },
    },
  ];

  const pages: Array<{
    link: string;
    title: string;
  }> = [
    {
      link: '/',
      title: 'Home',
    },
    {
      link: '/products',
      title: 'Products',
    },
    {
      link: '/about',
      title: 'About',
    },
  ];

  const title = `Desert Bake | ${pageTitle}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />
        <link rel="icon" href="/favicon.jpg" />
      </Head>
      <Box as="nav" bgColor="white" boxShadow="base" py="0.7rem" px="4rem" fontSize="1.1rem">
        <Grid templateColumns={'1fr 1fr 1fr'} alignItems={'center'}>
          <Box justifySelf={'start'}>
            <Link href="/">
              <Text as="b" fontSize="1.3rem">
                <Img src="/img/logo.png" alt="Desert Bake" h="3rem" />
              </Text>
            </Link>
          </Box>

          <Box display="flex" gap="2rem" justifySelf={'center'}>
            {pages.map((page, index) => (
              <Fragment key={index}>
                <Link href={page.link}>
                  <Text _hover={{ color: 'brand.400' }}>{page.title}</Text>
                </Link>
              </Fragment>
            ))}
          </Box>

          <Box display="flex" gap="1rem" alignItems={'center'} justifySelf={'end'}>
            {user ? (
              <>
                {Icons.map((icon, i) => (
                  <Box key={i} boxSize="1.3rem" _hover={{ color: 'brand.400' }}>
                    <Link
                      href={icon.href}
                      onClick={(e: Event) => {
                        icon.fc(e);
                      }}
                    >
                      {icon.icon}
                    </Link>
                  </Box>
                ))}
              </>
            ) : (
              <>
                <Button bgColor={'brand.400'} color={'white'} _hover={{ bgColor: 'brand.600' }}>
                  <Link href={'/signin'}>Login</Link>
                </Button>
                <Button bgColor={'transparent'} color={'brand.400'} borderWidth={'2px'} borderColor={'brand.400'} _hover={{ bgColor: 'brand.50' }}>
                  <Link href={'/signup'}>Sign Up</Link>
                </Button>
              </>
            )}
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default Navbar;
