export const createNews = (news) =>{
    return(dispatch, getState, {getFirebase, getFirestore}) =>{
        dispatch({type: 'CREATE_NEWS', news});
    }
};