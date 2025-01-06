import axios from 'axios';

const options = {
  method: 'POST',
  url: 'https://textflow-sms-api.p.rapidapi.com/send-sms',
  headers: {
    'x-rapidapi-key': 'b9a9a1c3c9msh2aede9a85e4a17fp111364jsnf6df7a3b6a5d',
    'x-rapidapi-host': 'textflow-sms-api.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    phone_number: '+918779112732',
    text: 'Test message from TextFlow'
  }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error);
}