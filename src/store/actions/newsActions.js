export const createNews = news =>{
    return(dispatch, getState, {getFirebase}) =>{
        const firestore = getFirebase().firestore();
        //const authorId = getState().firebase.auth.uid;
        firestore
        .collection('news')
        .add({
            ...news,
           // authorId : authorId,
            //date : new Date()
        })
        .then(() => {
            dispatch({
                type: 'CREATE_NEWS',
                news
            });
        })
        .catch((err) => {
            dispatch({
                type: 'CREATE_NEWS_ERROR',
                err
            });
        });
    };
};