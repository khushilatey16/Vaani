const formatDate = (date) => {
    const d = new Date(date);
    let month = `${d.getMonth() + 1}`; // Use 'let' to allow modification
    let day = `${d.getDate()}`; // Use 'let' to allow modification
    const year = `${d.getFullYear()}`;
  
    if (month.length < 2) {
      month = `0${month}`; // Add leading zero if month is single digit
    }
  
    if (day.length < 2) {
      day = `0${day}`; // Add leading zero if day is single digit
    }
  
    return [year, month, day].join('-'); // Return formatted date
  };
  
  export default formatDate;
  