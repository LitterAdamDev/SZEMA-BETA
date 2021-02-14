export const createNews = (news) =>{
    return(dispatch, getState) =>{
        dispatch({type: 'CREATE_NEWS', news});
    }
}