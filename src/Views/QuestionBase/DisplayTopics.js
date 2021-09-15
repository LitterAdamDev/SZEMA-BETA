// Import Firestore database
import db from '../../config/base'
import { useState } from 'react';

const DisplayTopics = () => {

	const [info , setInfo] = useState([]);

	// Start the fetch operation as soon as
	// the page loads
	window.addEventListener('load', () => {
		Fetchdata();
	});

	// Fetch the required data using the get() method
	const Fetchdata = ()=>{
		db.collection("topics").get().then((querySnapshot) => {
			// Loop through the data and store
			// it in array to display
			querySnapshot.forEach(element => {
				var data = element.data();
				setInfo(arr => [...arr , data]);
				
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
			<Frame course={data.CourseEnrolled}
				name={data.Nane}
				age={data.Age}/>
			))
		}
		</div>

	);
}

// Define how each display entry will be structured
const Frame = ({course , name , age}) => {
	console.log(course + " " + name + " " + age);
	return (
	
			<div className="div">
                <p>NAME : {name}</p>
                <p>Age : {age}</p>
                <p>Course : {course}</p>

			</div>
		
	);
}

export default DisplayTopics;
