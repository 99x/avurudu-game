const initialState = {
    testDate : "test data work"
}

const userReducer = (state = initialState , action) => {
    if(action.type = "CREATE_USER_FULFILLED"){
        // console.log("called " + action.payload)
    }
    return state
}

export default userReducer