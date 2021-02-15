const initState = {
    allnews: [
        {date:'2020-09-06', message:'Üdvözöllek a Műszaki Ábrázolás tanulásához és oktatásához készült applikációban!', profileImage:'https://firebasestorage.googleapis.com/v0/b/szema-ac882.appspot.com/o/management.png?alt=media&token=1ded933d-08ca-40f2-8180-bbcd7dffb767', user:'Admin'},
        {date:'2320-09-06', message:'Hell yeah', profileImage:'https://firebasestorage.googleapis.com/v0/b/szema-ac882.appspot.com/o/management.png?alt=media&token=1ded933d-08ca-40f2-8180-bbcd7dffb767', user:'Admin'}
    ]
}

const newsReducer = (state = initState, action) =>{
    switch(action.type){
        case 'CREATE_NEWS':
            console.log('created news', action.news);
            return state;
        case 'CREATE_NEWS_ERROR':
            console.log('create news error', action.err);
            return state;
        default:
            return state;
    }
}
export default newsReducer