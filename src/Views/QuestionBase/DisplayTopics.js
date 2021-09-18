// Import Firestore database
import {db} from '../../config/base'
import { useState, useEffect } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

const DisplayTopics = () => {
	const [info , setInfo] = useState([]);
	// with no callback attributes it only gets called once at the first render
	useEffect(() => {
		Fetchdata();
	},[]);
	// Fetch the required data using the get() method
	const Fetchdata = ()=>{
		db.collection("topics").get().then((querySnapshot) => {
			// Loop through the data and store
			// it in array to display
			querySnapshot.forEach(element => {
				var data = element.data();
                //console.log(data);
				setInfo(arr => [...arr , {...data, id: data.id}]);
			});
		})
	}

	// Display the result on the page
	return (
		<div className="asd">
        <FormControl style ={{width: 'auto', marginLeft: '-28vw'}}>
        <InputLabel  id="demo-simple-select-helper-label">Témakör kiválasztása</InputLabel>
        <Select 
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper">
                {
                info.map((data) => (
                <MenuItem value={data.Topicname}>{data.Topicname}</MenuItem>
                ))
                }
                 </Select>
                 <FormHelperText>Témakör kiválasztása a kérdés kategorizálásához</FormHelperText>
       </FormControl>
        <p style={{marginTop: '-2vw'}}>Gomb</p>

       </div> 
	);
}
export default DisplayTopics;