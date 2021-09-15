// Import Firestore database
import {db} from '../../config/base'
import { useState, useEffect } from 'react';

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
				setInfo(arr => [...arr , {...data, id: data.id}]);
			});
		})
	}
	
	// Display the result on the page
	return (
		<div>
			<center>
			<h2>Topic details</h2>
			</center>

		{
			info.map((data) => (
			<Frame course={data.Description}
				name={data.Topicname}
				age={data.Createdby}/>
			))
		}
		</div>

	);
}

// Define how each display entry will be structured
const Frame = ({description , topicname , createdby}) => {
	console.log(description + " " + topicname + " " + createdby);
	return (
	
			<div className="div">
                <p>nev : {topicname}</p>
                <p>letrehozo : {createdby}</p>
                <p>topik leiras : {description}</p>

			</div>
		
	);
}

export default DisplayTopics;
