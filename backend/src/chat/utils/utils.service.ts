

export function getDate() : Date {
	// const dateNow = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).format(Date.now());
	// console.log("dateNow : ", dateNow);
	// return dateNow;
// Get the current date
const currentDate = new Date();

// Add 2 hours to the current date
currentDate.setHours(currentDate.getHours() + 2);

console.log('Current Date and Time:', currentDate);
return currentDate;

}

export function compareDateMessageTimeStamp() {

}
