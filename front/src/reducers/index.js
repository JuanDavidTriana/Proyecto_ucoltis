import { combineReducers } from "redux";
import {
    productsListReducer,
    productDetailsReducer,
    createProductReducer,
    updateProductReducer,
    deleteProductReducer,
    changeDeliveryStatusReducer,
} from "./productReducers";

import {
    createCardReducer,
    chargeCardReducer,
    savedCardsListReducer,
    deleteSavedCardReducer,
    updateCardtReducer
} from "./cardReducers";

import {
    userLoginReducer,
    userRegisterReducer,
    userDetailsReducer,
    userDetailsUpdateReducer,
    deleteUserAccountReducer,
    checkTokenValidationReducer,
    getSingleAddressReducer,
    getAllAddressesOfUserReducer,
    createUserAddressReducer,
    updateUserAddressReducer,
    deleteUserAddressReducer,
    getAllOrdersReducer,
} from "./userReducers";

const allReducers = combineReducers({
    productsListReducer,
    productDetailsReducer,
    createProductReducer,
    updateProductReducer,
    deleteProductReducer,
    createCardReducer,
    chargeCardReducer,
    savedCardsListReducer,
    updateCardtReducer,
    deleteSavedCardReducer,
    userLoginReducer,
    userRegisterReducer,    
    getSingleAddressReducer,
    getAllAddressesOfUserReducer,
    createUserAddressReducer,
    updateUserAddressReducer,
    deleteUserAddressReducer,
    getAllOrdersReducer,
    changeDeliveryStatusReducer,
    checkTokenValidationReducer,
    userDetailsReducer,
    userDetailsUpdateReducer,
    deleteUserAccountReducer,
})


export default allReducers