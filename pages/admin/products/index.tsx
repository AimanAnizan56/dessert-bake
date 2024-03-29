import { Alert, AlertIcon, Box, Button, Container, Flex, Grid, GridItem, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { ironSessionOptions } from '../../../lib/helper';
import { SkeletonProductGridItem } from '../../../components/Skeleton.component';
import axios from 'axios';
import Image from 'next/image';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const Products = (props: any) => {
  const [products, setProducts] = useState<Array<any>>();
  const [currentSelectedId, setCurrentSelectedId] = useState();
  const [skeleton, setSkeleton] = useState(true);

  const [modalState, setModalState] = useState({
    isOpen: false,
    onClose: () => {
      console.log('closing modal');
      setModalState({ ...modalState, isOpen: false });
    },
  });
  const [alertOn, setAlertOn] = useState({
    status: undefined as 'success' | 'info' | 'warning' | 'error' | 'loading' | undefined,
    trigger: false,
    message: 'Alert',
  });

  const [deleteButton, setDeleteButton] = useState({
    isLoading: false,
  });

  useEffect(() => {
    callProductAPI();
  }, []);

  const callProductAPI = async () => {
    const res = await axios.get('/api/v1/products');
    const { data } = res.data;

    if (data) {
      setProducts(data);
      setSkeleton(false);
    }

    if (res.status == 204) {
      setSkeleton(false);
    }
  };

  const clickHandler = (e: any) => {
    setCurrentSelectedId(e.target.dataset.currentId);
    setModalState({
      ...modalState,
      isOpen: true,
    });
  };

  const deleteProduct = async () => {
    setDeleteButton({ ...deleteButton, isLoading: true });

    try {
      const res: any = await axios.delete(`/api/v1/products/${currentSelectedId}`);
      const { message } = res.data;

      if (res.status == 200) {
        console.log('if in deleteProduct executed');
        callProductAPI();
        modalState.onClose();

        setAlertOn({
          status: 'success',
          trigger: true,
          message: message,
        });

        setTimeout(() => {
          setAlertOn({
            ...alertOn,
            trigger: false,
          });
        }, 2500);
      }
    } catch (err) {
      console.log('====================================');
      console.log('|deleteProduct| Error : ', err);
      console.log('====================================');
    } finally {
      setDeleteButton({ ...deleteButton, isLoading: false });
    }
  };

  return (
    <>
      <Navbar pageTitle="Products" pageDescription="Product page" user={props.user} currentPage={'Products'} />

      <main>
        <Container maxW={'container.lg'}>
          <Flex mt={'2rem'} justifyContent={'space-between'} alignItems={'center'}>
            <Heading as="h1" size={'lg'} color={'brand.400'}>
              Products
            </Heading>

            <Box as="div">
              <Button size={'sm'} colorScheme={'whatsapp'}>
                <Link href={'/admin/products/create'}>+ Add Product</Link>
              </Button>
            </Box>
          </Flex>

          <Grid templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)', 'repeat(3, 1fr)']} gap={5} my={'2.5rem'}>
            {skeleton && (
              <>
                <SkeletonProductGridItem />
                <SkeletonProductGridItem />
                <SkeletonProductGridItem />
              </>
            )}

            {!products && !skeleton && <Box as="div">No product found!</Box>}

            {products &&
              products.map((product, i) => {
                return (
                  <Fragment key={i}>
                    <GridItem boxShadow={'var(--box-shadow)'} borderRadius={'5px'} px={'0.5rem'} py={'1rem'}>
                      <Box as="div" mb={'0.5rem'} position={'relative'} width={'100%'} height={'200px'}>
                        <Image fill sizes="auto" src={product.product_image_path} alt={product.product_name} />
                      </Box>
                      <Box as="div" fontWeight={'bold'}>
                        {product.product_name}
                      </Box>
                      <Box as="div" mb={'0.5rem'} fontWeight={'bold'} color={'gray.400'}>
                        RM {product.product_price}
                      </Box>
                      <Box as="div">
                        <Box as="div" mb={'0.5rem'}>
                          <Link href={`/admin/products/${product.product_id}/edit`}>
                            <Button leftIcon={<EditIcon />} colorScheme={'brand'} width={'100%'}>
                              Edit
                            </Button>
                          </Link>
                        </Box>

                        <Button leftIcon={<DeleteIcon />} colorScheme={'red'} variant={'outline'} width={'100%'} data-current-id={product.product_id} onClick={clickHandler}>
                          Delete
                        </Button>
                      </Box>
                    </GridItem>
                  </Fragment>
                );
              })}
          </Grid>
        </Container>

        <Modal isOpen={modalState.isOpen} onClose={modalState.onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete</ModalHeader>
            <ModalCloseButton />

            <ModalBody>Are you sure you want to delete this item?</ModalBody>

            <ModalFooter>
              <Button mx={2} colorScheme={'red'} width={'5rem'} variant={'outline'} onClick={modalState.onClose}>
                Cancel
              </Button>

              <Button isLoading={deleteButton.isLoading} colorScheme={'red'} width={'5rem'} onClick={deleteProduct}>
                Yes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </main>

      {alertOn.trigger && (
        <Alert status={alertOn.status} w="30vw" mx="auto" position={'fixed'} left={'50vw'} bottom={'2rem'} transform={'translateX(-50%)'}>
          <AlertIcon />
          {alertOn.message}
        </Alert>
      )}
    </>
  );
};

export default Products;

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(async ({ req }) => {
  const user = req.session.user;

  if (user && user.admin) {
    return {
      props: {
        user: user,
      },
    };
  }

  return {
    redirect: {
      destination: '/admin/signin',
      permanent: true,
    },
    props: {},
  };
}, ironSessionOptions);
