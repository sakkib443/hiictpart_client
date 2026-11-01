import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./CourseSlice";
import categoryReducer from "./categorySlice";
import softwareReducer from "./softwareSlice";
import websiteReducer from "./websiteSlice";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
import downloadReducer from "./downloadSlice";
import enrollmentReducer from "./enrollmentSlice";

import reviewReducer from "./reviewSlice";

export default configureStore({
  reducer: {
    courses: courseReducer,
    categories: categoryReducer,
    software: softwareReducer,
    websites: websiteReducer,
    cart: cartReducer,
    order: orderReducer,
    download: downloadReducer,
    enrollment: enrollmentReducer,
    reviews: reviewReducer,
  },
});



