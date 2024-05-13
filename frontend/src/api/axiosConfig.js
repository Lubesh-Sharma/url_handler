import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:4000',
    header: {"ngrok-skip-browser-warning":"true"}
});