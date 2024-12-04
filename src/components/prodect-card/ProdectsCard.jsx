import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

const ProdectsCard = () => {
  const [filterCategories, setFilterCategories] = useState([]);
  const [Products, setProducts] = useState([]);
  const [isLoad, setLoad] = useState(true);
  const [categoryArr, setCategory] = useState([]);

  const filterProducts = (categoryProduct) => {
    const filterCategory = Products.filter(
      (item) => item.category.name === categoryProduct.value
    );
    setFilterCategories(filterCategory);
  };

  useEffect(() => {
    axios.get("https://api.escuelajs.co/api/v1/products").then((data) => {
      const FilterData = data.data.filter(
        (product) => product.title !== "New Product"
      );

      const categoryArr = FilterData.map((item) => ({
        label: item.category.name,
        value: item.category.name,
      }));

      const uniqueArr = categoryArr.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.value === item.value)
      );

      setCategory(uniqueArr);
      setProducts(FilterData);
      setFilterCategories(FilterData);
      setLoad(false);
    });
  }, []);

  return (
    <Box className="px-5 mt-5">
      <Box className="mt-5 ms-4 mb-3">
        <Autocomplete
          disablePortal
          options={categoryArr}
          sx={{ width: 300 }}
          onChange={(e, newValue) => filterProducts(newValue)}
          renderInput={(params) => <TextField {...params} label="Category" />}
        />
      </Box>


      <Grid container spacing={3}>
        {isLoad ? (
          <Box className="my-5 w-100 text-center">
            <CircularProgress size="3rem" />
          </Box>
        ) : (
          filterCategories.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card className="text-center px-3 m-3">
                <Swiper
                  spaceBetween={30}
                  centeredSlides={true}
                  autoplay={{
                    delay: 5500,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  navigation={false}
                  modules={[Autoplay, Pagination, Navigation]}
                  className="mySwiper"
                >
                  {product.images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={img}
                        className="img-fluid"
                        alt={product.title}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <Box className="text-start">
                  <Typography variant="body2" className="mt-2 text-start">
                    {product.category.name}
                  </Typography>
                  <Typography variant="h6" className="mt-2 text-start">
                    {product.title}
                  </Typography>
                  <Rating
                    name="read-only"
                    value={Math.round(product.rating) || 0}
                    readOnly
                  />
                  <Box className="d-flex justify-content-between align-items-center pb-3 mt-2">
                    <Typography variant="h6">${product.price}</Typography>
                    <Button variant="contained">
                      <AddIcon /> Add
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default ProdectsCard;
