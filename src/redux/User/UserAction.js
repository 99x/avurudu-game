import Axios from "axios"

export const createUser = (user) => {
    return dispatch => {
        dispatch({
            type: "CREATE_USER",
            payload: new Promise((resolve, reject) => { 
                resolve(user)
            })
        })
    }
}

